const {
  supabase,
} = require("../config/supabase");

const ALLOWED_ROLES = [
  "admin",
  "manager",
  "user",
  "guest",
];

const normalizeUser = (
  profile,
  authUser = null
) => {
  const name = [
    profile.first_name,
    profile.last_name,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    id: profile.id,
    name,
    first_name:
      profile.first_name || "",
    last_name:
      profile.last_name || "",
    email:
      authUser?.email || "",
    role: profile.role,
    created_at:
      profile.created_at,
    updated_at:
      profile.updated_at,
  };
};

// ==========================================
// GET ALL USERS
// GET /api/admin/users
// ==========================================

const getUsers = async (
  req,
  res
) => {
  try {
    const {
      search = "",
      role = "",
    } = req.query;

    if (
      role &&
      !ALLOWED_ROLES.includes(role)
    ) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    let profileQuery =
      supabase
        .from("profiles")
        .select(`
          id,
          first_name,
          last_name,
          role,
          created_at,
          updated_at
        `)
        .order("created_at", {
          ascending: false,
        });

    if (role) {
      profileQuery =
        profileQuery.eq(
          "role",
          role
        );
    }

    const {
      data: profiles,
      error: profileError,
    } = await profileQuery;

    if (profileError) {
      throw profileError;
    }

    const {
      data: authUsersData,
      error: authUsersError,
    } =
      await supabase.auth.admin.listUsers(
        {
          page: 1,
          perPage: 1000,
        }
      );

    if (authUsersError) {
      throw authUsersError;
    }

    const authUsers =
      authUsersData?.users || [];

    const authUserMap =
      new Map(
        authUsers.map(
          (authUser) => [
            authUser.id,
            authUser,
          ]
        )
      );

    let users = (
      profiles || []
    ).map((profile) =>
      normalizeUser(
        profile,
        authUserMap.get(
          profile.id
        )
      )
    );

    if (search.trim()) {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      users = users.filter(
        (user) =>
          user.name
            .toLowerCase()
            .includes(
              normalizedSearch
            ) ||
          user.email
            .toLowerCase()
            .includes(
              normalizedSearch
            )
      );
    }

    return res.status(200).json({
      users,
    });
  } catch (error) {
    console.error(
      "Get users error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch users",
    });
  }
};

// ==========================================
// GET USER BY ID
// GET /api/admin/users/:id
// ==========================================

const getUserById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select(`
        id,
        first_name,
        last_name,
        role,
        created_at,
        updated_at
      `)
      .eq("id", id)
      .maybeSingle();

    if (profileError) {
      throw profileError;
    }

    if (!profile) {
      return res.status(404).json({
        message:
          "User profile not found",
      });
    }

    const {
      data: authUserData,
      error: authUserError,
    } =
      await supabase.auth.admin.getUserById(
        id
      );

    if (authUserError) {
      throw authUserError;
    }

    return res.status(200).json({
      user: normalizeUser(
        profile,
        authUserData?.user
      ),
    });
  } catch (error) {
    console.error(
      "Get user by ID error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch user",
    });
  }
};

// ==========================================
// CREATE USER
// POST /api/admin/users
// ==========================================

const createUser = async (
  req,
  res
) => {
  let createdAuthUserId = null;

  try {
    const {
      first_name,
      last_name,
      email,
      password,
      role = "user",
    } = req.body;

    if (
      !first_name?.trim() ||
      !last_name?.trim() ||
      !email?.trim() ||
      !password
    ) {
      return res.status(400).json({
        message:
          "First name, last name, email and password are required",
      });
    }

    if (
      !ALLOWED_ROLES.includes(role)
    ) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    // Create Supabase Auth user
    const {
      data: authData,
      error: authError,
    } =
      await supabase.auth.admin.createUser(
        {
          email:
            normalizedEmail,
          password,
          email_confirm: true,

          user_metadata: {
            first_name:
              first_name.trim(),
            last_name:
              last_name.trim(),

            full_name: `${first_name.trim()} ${last_name.trim()}`,
          },
        }
      );

    if (authError) {
      return res.status(400).json({
        message:
          authError.message ||
          "Failed to create authentication user",
      });
    }

    if (!authData?.user) {
      return res.status(500).json({
        message:
          "Authentication user was not created",
      });
    }

    createdAuthUserId =
      authData.user.id;

    // A signup trigger may already have created
    // the profile. Upsert keeps both cases safe.
    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .upsert(
        {
          id:
            authData.user.id,

          first_name:
            first_name.trim(),

          last_name:
            last_name.trim(),

          role,
        },
        {
          onConflict: "id",
        }
      )
      .select(`
        id,
        first_name,
        last_name,
        role,
        created_at,
        updated_at
      `)
      .single();

    if (profileError) {
      // Roll back Auth user if profile creation fails.
      await supabase.auth.admin.deleteUser(
        createdAuthUserId
      );

      createdAuthUserId = null;

      throw profileError;
    }

    return res.status(201).json({
      message:
        "User created successfully",

      user: normalizeUser(
        profile,
        authData.user
      ),
    });
  } catch (error) {
    console.error(
      "Create user error:",
      error
    );

    return res.status(500).json({
      message:
        error?.message ||
        "Failed to create user",
    });
  }
};

// ==========================================
// UPDATE USER
// PATCH /api/admin/users/:id
// ==========================================

const updateUser = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const {
      first_name,
      last_name,
      email,
      password,
      role,
    } = req.body;

    const {
      data: existingProfile,
      error: existingProfileError,
    } = await supabase
      .from("profiles")
      .select(`
        id,
        first_name,
        last_name,
        role
      `)
      .eq("id", id)
      .maybeSingle();

    if (existingProfileError) {
      throw existingProfileError;
    }

    if (!existingProfile) {
      return res.status(404).json({
        message:
          "User profile not found",
      });
    }

    if (
      role !== undefined &&
      !ALLOWED_ROLES.includes(role)
    ) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    if (
      req.user.id === id &&
      role !== undefined &&
      role !== "admin"
    ) {
      return res.status(400).json({
        message:
          "You cannot remove your own admin role",
      });
    }

    if (
      password !== undefined &&
      password !== "" &&
      password.length < 6
    ) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters",
      });
    }

    const profileUpdates = {};

    if (first_name !== undefined) {
      if (!first_name.trim()) {
        return res.status(400).json({
          message:
            "First name cannot be empty",
        });
      }

      profileUpdates.first_name =
        first_name.trim();
    }

    if (last_name !== undefined) {
      if (!last_name.trim()) {
        return res.status(400).json({
          message:
            "Last name cannot be empty",
        });
      }

      profileUpdates.last_name =
        last_name.trim();
    }

    if (role !== undefined) {
      profileUpdates.role = role;
    }

    // Update Auth fields
    const authUpdates = {};

    if (email !== undefined) {
      if (!email.trim()) {
        return res.status(400).json({
          message:
            "Email cannot be empty",
        });
      }

      authUpdates.email =
        email.trim().toLowerCase();

      authUpdates.email_confirm =
        true;
    }

    if (
      password !== undefined &&
      password !== ""
    ) {
      authUpdates.password =
        password;
    }

    const finalFirstName =
      profileUpdates.first_name ??
      existingProfile.first_name;

    const finalLastName =
      profileUpdates.last_name ??
      existingProfile.last_name;

    authUpdates.user_metadata = {
      first_name:
        finalFirstName,

      last_name:
        finalLastName,

      full_name: [
        finalFirstName,
        finalLastName,
      ]
        .filter(Boolean)
        .join(" "),
    };

    const {
      data: authData,
      error: authError,
    } =
      await supabase.auth.admin.updateUserById(
        id,
        authUpdates
      );

    if (authError) {
      return res.status(400).json({
        message:
          authError.message ||
          "Failed to update authentication user",
      });
    }

    let profile =
      existingProfile;

    if (
      Object.keys(
        profileUpdates
      ).length > 0
    ) {
      const {
        data: updatedProfile,
        error: profileError,
      } = await supabase
        .from("profiles")
        .update(
          profileUpdates
        )
        .eq("id", id)
        .select(`
          id,
          first_name,
          last_name,
          role,
          created_at,
          updated_at
        `)
        .single();

      if (profileError) {
        throw profileError;
      }

      profile =
        updatedProfile;
    } else {
      const {
        data: fullProfile,
        error: fullProfileError,
      } = await supabase
        .from("profiles")
        .select(`
          id,
          first_name,
          last_name,
          role,
          created_at,
          updated_at
        `)
        .eq("id", id)
        .single();

      if (fullProfileError) {
        throw fullProfileError;
      }

      profile = fullProfile;
    }

    return res.status(200).json({
      message:
        "User updated successfully",

      user: normalizeUser(
        profile,
        authData?.user
      ),
    });
  } catch (error) {
    console.error(
      "Update user error:",
      error
    );

    return res.status(500).json({
      message:
        error?.message ||
        "Failed to update user",
    });
  }
};

// ==========================================
// UPDATE USER ROLE
// PATCH /api/admin/users/:id/role
// ==========================================

const updateUserRole = async (
  req,
  res
) => {
  try {
    const { id } =
      req.params;

    const { role } =
      req.body;

    if (
      !ALLOWED_ROLES.includes(role)
    ) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    if (
      req.user.id === id &&
      role !== "admin"
    ) {
      return res.status(400).json({
        message:
          "You cannot remove your own admin role",
      });
    }

    const {
      data: profile,
      error,
    } = await supabase
      .from("profiles")
      .update({
        role,
      })
      .eq("id", id)
      .select(`
        id,
        first_name,
        last_name,
        role,
        created_at,
        updated_at
      `)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!profile) {
      return res.status(404).json({
        message:
          "User profile not found",
      });
    }

    const {
      data: authUserData,
      error: authUserError,
    } =
      await supabase.auth.admin.getUserById(
        id
      );

    if (authUserError) {
      throw authUserError;
    }

    return res.status(200).json({
      message:
        "User role updated successfully",

      user: normalizeUser(
        profile,
        authUserData?.user
      ),
    });
  } catch (error) {
    console.error(
      "Update role error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to update role",
    });
  }
};

// ==========================================
// DELETE USER
// DELETE /api/admin/users/:id
// ==========================================

const deleteUser = async (
  req,
  res
) => {
  try {
    const { id } =
      req.params;

    // Never allow the logged-in admin
    // to delete themselves.
    if (req.user.id === id) {
      return res.status(400).json({
        message:
          "You cannot delete your own account",
      });
    }

    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (profileError) {
      throw profileError;
    }

    if (!profile) {
      return res.status(404).json({
        message:
          "User profile not found",
      });
    }

    /*
      Delete the Supabase Auth user.

      If profiles.id has:
      REFERENCES auth.users(id)
      ON DELETE CASCADE

      the profile will automatically
      be deleted as well.
    */
    const {
      error: authDeleteError,
    } =
      await supabase.auth.admin.deleteUser(
        id
      );

    if (authDeleteError) {
      throw authDeleteError;
    }

    // Defensive cleanup in case your FK
    // does not use ON DELETE CASCADE.
    const {
      error: profileDeleteError,
    } = await supabase
      .from("profiles")
      .delete()
      .eq("id", id);

    if (
      profileDeleteError &&
      profileDeleteError.code !==
        "PGRST116"
    ) {
      console.error(
        "Profile cleanup error:",
        profileDeleteError
      );
    }

    return res.status(200).json({
      message:
        "User deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete user error:",
      error
    );

    return res.status(500).json({
      message:
        error?.message ||
        "Failed to delete user",
    });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserRole,
  deleteUser,
};