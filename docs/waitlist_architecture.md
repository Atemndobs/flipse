# Waitlist Architecture

This document outlines the architecture for implementing the backend functionality for the Flipse waitlist.

## Current Implementation

Currently, the waitlist form in `src/components/Hero.tsx` captures the user's email and stores it in the browser's `localStorage`. Upon successful submission, the `WaitlistModal` (`src/components/WaitlistModal.tsx`) is displayed, showing a thank you message. There is no backend interaction.

## Proposed Architecture

We will use Supabase as the backend for storing waitlist data. Supabase provides a PostgreSQL database, authentication, and real-time capabilities, making it a suitable choice for this project.

### 1. Supabase Setup

*   **Project:** Create a new Supabase project. (Completed)
*   **Database:** Create a new database within the project. (Completed)
*   **Table:** Create a `waitlist` table with the following schema: (Completed)

    | Column          | Type      | Constraints        |
    | --------------- | --------- | ------------------ |
    | `id`            | UUID      | Primary Key, Default: `uuid_generate_v4()` |
    | `email`         | TEXT      | Unique             |
    | `created_at`    | TIMESTAMP | Default: `now()`   |
    | `referral_code` | TEXT      | Optional           |

    **SQL to create table:**

    ```sql
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE waitlist (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      email TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      referral_code TEXT
    );
    ```

### 2. Install Supabase Client

*   Run `npm install @supabase/supabase-js` to install the Supabase client library.

### 2. API Endpoint

*   **File:** `pages/api/waitlist.ts` (Next.js API route)
*   **Method:** POST
*   **Logic:**

    1.  **Initialize Supabase Client:**
        *   Use the credentials from the `.env` file to initialize the Supabase client.
    1.  **Validate Email:**
        *   Use a regular expression to validate the email format.
        *   Return an error response (e.g., 400 Bad Request) if the email is invalid.
    2.  **Check for Duplicates:**
        *   Query the `waitlist` table to check if the email already exists.
        *   Return an error response (e.g., 409 Conflict) if the email is a duplicate.
    3.  **Insert into Database:**
        *   If the email is valid and not a duplicate, insert a new row into the `waitlist` table.
        *   Use the Supabase client library for database interactions.
    4.  **Return Response:**
        *   On success: Return a 201 Created response.
        *   On error: Return an appropriate error response (400, 409, or 500).

### 3. Frontend Integration

*   **Modify `handleSubmit` in `src/components/Hero.tsx`:**

    1.  **Prevent Default:** Prevent the default form submission behavior.
    2.  **API Request:**
        *   Send a POST request to `/api/waitlist` with the email data in the request body (as JSON).
        *   Use `fetch` or a similar library for making the API call.
    3.  **Handle Response:**
        *   **Success (201):**
            *   Set `submittedEmail` and `isModalOpen` to display the `WaitlistModal`.
        *   **Error (4xx or 5xx):**
            *   Display an appropriate error message to the user.  Consider using a state variable to manage the error message.
    4. **Remove LocalStorage Logic:** Remove the existing code that stores the email in `localStorage`.

### 4. Error Handling

*   **API Route:**
    *   Wrap the API logic in a `try...catch` block to handle potential errors (e.g., database connection issues, query errors).
    *   Return appropriate error responses with informative messages.
*   **Frontend:**
    *   Handle potential network errors during the API call (e.g., using `.catch()` with `fetch`).
    *   Display user-friendly error messages for different error scenarios.

### 5. Security

* **Input Validation:** Sanitize and validate the email input on both the client-side and server-side to prevent injection attacks.
* **Rate Limiting:** Consider implementing rate limiting on the API endpoint to prevent abuse (e.g., using a library or Supabase features). This is a future enhancement.

### 6. Future Enhancements

*   **Referral Codes:** Generate and store unique referral codes for each waitlist entry.
*   **Email Notifications:** Send confirmation emails to users upon joining the waitlist.
*   **Admin Dashboard:** Create an admin interface to manage the waitlist data.
*   **Rate Limiting:** Implement to prevent abuse.