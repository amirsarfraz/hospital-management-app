# Hospital Management System

A responsive Hospital Management System built with Next.js for managing hospital operations such as doctors, nurses, patients, departments, treatments, rooms, and billing.

## Features

- User authentication
- Role-based access control
  - Admin
  - Manager
  - Guest
- Dashboard with hospital statistics
- Department management
- Doctor management
- Nurse management
- Patient management
- Treatment management
- Room management
- Billing management
- Search and filtering
- Responsive user interface
- Protected routes based on authentication and user roles

### Role Access

- **Admin**: Can view, create, edit, and delete records
- **Manager**: Can view, create, edit, and delete permitted records
- **Guest**: Read-only access to permitted sections

## Tech Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- Supabase Authentication

### Backend

- Node.js
- Express.js
- Supabase
- REST API
- Swagger API Documentation

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd <project-folder>