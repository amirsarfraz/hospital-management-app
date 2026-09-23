const {
  supabase,
} = require(
  "../config/supabase"
);

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

    // Get application profiles
    let profileQuery =
      supabase
        .from("profiles")
        .select(
          `
          id,
          first_name,
          last_name,
          role,
          created_at,
          updated_at
          `
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

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
    } =
      await profileQuery;

    if (profileError) {
      throw profileError;
    }

    // Get Supabase auth users
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

    let users =
      (profiles || []).map(
        (profile) => {
          const authUser =
            authUserMap.get(
              profile.id
            );

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
              profile.first_name,
            last_name:
              profile.last_name,
            email:
              authUser?.email ||
              "",
            role:
              profile.role,
            created_at:
              profile.created_at,
            updated_at:
              profile.updated_at,
          };
        }
      );

    // Search after profile + auth data are combined
    if (search) {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      users = users.filter(
        (user) =>
          user.name
            ?.toLowerCase()
            .includes(
              normalizedSearch
            ) ||
          user.email
            ?.toLowerCase()
            .includes(
              normalizedSearch
            )
      );
    }

    return res
      .status(200)
      .json({
        users,
      });
  } catch (error) {
    console.error(
      "Get users error:",
      error
    );

    return res
      .status(500)
      .json({
        message:
          "Failed to fetch users",
      });
  }
};

// ==========================================
// UPDATE USER ROLE
// PATCH /api/admin/users/:id/role
// ==========================================

const updateUserRole =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const { role } =
        req.body;

      const allowedRoles = [
        "admin",
        "manager",
        "user",
        "guest",
      ];

      if (
        !allowedRoles.includes(
          role
        )
      ) {
        return res
          .status(400)
          .json({
            message:
              "Invalid role",
          });
      }

      // Prevent admin from removing their own admin role
      if (
        req.user.id === id &&
        role !== "admin"
      ) {
        return res
          .status(400)
          .json({
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
        .eq(
          "id",
          id
        )
        .select(
          `
          id,
          first_name,
          last_name,
          role,
          created_at,
          updated_at
          `
        )
        .single();

      if (error) {
        throw error;
      }

      if (!profile) {
        return res
          .status(404)
          .json({
            message:
              "User profile not found",
          });
      }

      // Get auth user so response contains email
      const {
        data: authUserData,
        error:
          authUserError,
      } =
        await supabase.auth.admin.getUserById(
          id
        );

      if (authUserError) {
        console.error(
          "Auth user lookup error:",
          authUserError
        );
      }

      const authUser =
        authUserData?.user;

      const name = [
        profile.first_name,
        profile.last_name,
      ]
        .filter(Boolean)
        .join(" ");

      return res
        .status(200)
        .json({
          message:
            "User role updated successfully",

          user: {
            id:
              profile.id,

            name,

            first_name:
              profile.first_name,

            last_name:
              profile.last_name,

            email:
              authUser?.email ||
              "",

            role:
              profile.role,

            created_at:
              profile.created_at,

            updated_at:
              profile.updated_at,
          },
        });
    } catch (error) {
      console.error(
        "Update role error:",
        error
      );

      return res
        .status(500)
        .json({
          message:
            "Failed to update role",
        });
    }
  };

module.exports = {
  getUsers,
  updateUserRole,
};