# **Kudos System Specification**

## **Functional Requirements**

### **User Stories**

1. **Selection:** As a user, I can select another user from a searchable dropdown list of colleagues.  
2. **Creation:** As a user, I can write a message of appreciation (max 500 characters).  
3. **Submission:** As a user, I can submit the kudos to be stored and displayed publicly.  
4. **Feed:** As a user, I can view a real-time feed of recent kudos on the dashboard.  
5. **Moderation (Admin):** As an administrator, I can hide or delete inappropriate kudos messages from the feed.

### **Acceptance Criteria**

* **Input Validation:** Messages cannot be empty or exceed 500 characters.  
* **Privacy:** Users cannot give kudos to themselves.  
* **Admin Control:** Hidden kudos must immediately disappear from the public feed but remain in the DB for audit.  
* **Responsiveness:** The UI must be fully functional on mobile and desktop.

## **Technical Design**

### **Database Schema (Proposed)**

| Table | Field | Type | Description |
| :---- | :---- | :---- | :---- |
| **Users** | id, name, role, email | UUID/String | Employee information |
| **Kudos** | id | UUID | Primary key |
| **Kudos** | sender\_id | UUID | FK to Users |
| **Kudos** | receiver\_id | UUID | FK to Users |
| **Kudos** | message | Text | Max 500 chars |
| **Kudos** | created\_at | Timestamp | Default: now() |
| **Kudos** | **is\_visible** | Boolean | Default: true (For moderation) |
| **Kudos** | **moderated\_by** | UUID | Admin user ID |
| **Kudos** | **moderated\_at** | Timestamp | When hidden/deleted |

### **Frontend Components**

* App: Main container and state management.  
* KudosForm: Selection logic and text input.  
* KudosFeed: Displaying the list of visible kudos.  
* AdminPanel: Moderation controls for users with the 'admin' role.

## **Implementation Plan**

1. Setup React and Tailwind CSS environment.  
2. Create mock user data and initial state.  
3. Build the KudosForm with character counting and validation.  
4. Build the KudosFeed with "Visible Only" filtering.  
5. Implement the AdminPanel toggle logic for is\_visible.