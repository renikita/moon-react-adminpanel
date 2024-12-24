# Moon Client-Side Application

This repository contains the client-side React application for **Moon**, including the main user interface and the admin panel. The application is designed to provide a seamless and intuitive user experience for both regular users and administrators, interacting with the server-side application via RESTful APIs.

---

## Key Features

### **User Authentication**
- Secure login functionality with session management.
- Forgot password feature for requesting password resets.

### **Admin Panel**
1. **Response Dashboard**
   - View, search, edit, and delete user responses.
   - Context menu for quick actions.
   - Modal for editing user details.

2. **Event Log**
   - Display and search through event logs.
   - Includes detailed information and action badges for easy identification.

3. **Profile Management**
   - View and edit admin profile details, such as login, name, and password.
   - Option to delete admin accounts with confirmation.

4. **Permission Settings**
   - Manage roles and permissions for different admins.
   - Create, update, and delete roles.
   - Assign roles to admins and delete admins with password confirmation.

### **Responsive Design**
- Fully responsive for a smooth experience on both desktop and mobile devices.

### **Theming**
- Choose between light, dark, and classic themes.
- Themes are saved and applied automatically on subsequent logins.

### **Security**
- Built-in security measures to protect user data and ensure safe interactions with the server.

---

## Technologies Used
- **React**: For building the user interface.
- **React Router**: For client-side routing.
- **Bootstrap**: For responsive design and styling.
- **Axios**: For making HTTP requests to the server.
- **JS-Cookie**: For managing cookies and session data.

---

## Getting Started

### **Installation**
1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/moon-client.git
   cd moon-client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### **Running the Application**
1. Start the development server:
   ```bash
   npm start
   ```
2. Open [http://localhost:3000](http://localhost:3000) in your browser.

### **Building for Production**
- Build the application for production:
  ```bash
  npm run build
  ```
- The production build files will be available in the `build/` directory.

---

## Folder Structure
- `src/`: Contains all the application source code.
  - `components/`: Reusable UI components.
  - `pages/`: Page-specific components.
  - `services/`: API service handlers.
  - `styles/`: Custom styles for the application.
- `public/`: Static assets for the application.

---

## Contributing
We welcome contributions to enhance the Moon client-side application! Follow these steps:
1. Fork this repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes and push to your branch:
   ```bash
   git commit -m "Add your message here"
   git push origin feature/your-feature-name
   ```
4. Submit a pull request.

---

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact
For questions or support, please contact the development team or create an issue in this repository.
