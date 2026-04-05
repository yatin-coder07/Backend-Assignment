# 🏥 Healthcare Backend System (Django + DRF)

---

## 🚀 Overview

This project is a **backend-focused healthcare management system** built using **Django, Django REST Framework, and PostgreSQL**.

It fulfills all the requirements of the assignment, including **authentication, patient management, doctor management, and patient-doctor mapping**, with secure and scalable API design.

To make API testing more practical and demonstrable, I also built a **minimal frontend interface** to interact with the backend in real time, along with a **separate demo video** showcasing full functionality.

---

## 🔗 Project Links

* 🎥 **Demo Video (Full Walkthrough):**
  https://youtu.be/P8YnzQPOkQc?si=i5llhQD6rxPVIaxp

* 💼 **LinkedIn Profile:**
  https://www.linkedin.com/in/yatin-sharma-12a34428b/

---

## 🧠 Key Features

✔ JWT-based Authentication (Secure login/register)
✔ Full CRUD for Patients
✔ Full CRUD for Doctors
✔ Patient ↔ Doctor Mapping System
✔ PostgreSQL Database Integration
✔ Protected Endpoints (Authentication Required)
✔ Clean Project Structure & Scalable Design
✔ Error Handling & Validation
✔ Environment Variables for Sensitive Data

---

## ⚙️ Tech Stack

* **Backend:** Django, Django REST Framework
* **Authentication:** JWT (djangorestframework-simplejwt)
* **Database:** PostgreSQL
* **Frontend (for testing):** Next.js
* **API Testing:** Postman + Custom UI

---

## 🔐 Authentication APIs

### ➤ Register

`POST /api/auth/register/`

* Allows users to create an account using:

  * Name
  * Email
  * Password

---

### ➤ Login

`POST /api/auth/login/`

* Returns **JWT Access + Refresh Tokens**
* Used for authenticated API requests

---

## 👤 Patient Management APIs

### ➤ Create Patient

`POST /api/patients/`

* Requires authentication

---

### ➤ Get All Patients

`GET /api/patients/`

* Returns only patients created by the logged-in user

---

### ➤ Get Single Patient

`GET /api/patients/<id>/`

---

### ➤ Update Patient

`PUT /api/patients/<id>/`

---

### ➤ Delete Patient

`DELETE /api/patients/<id>/`

---

## 👨‍⚕️ Doctor Management APIs

### ➤ Create Doctor

`POST /api/doctors/`

* Requires authentication

---

### ➤ Get All Doctors

`GET /api/doctors/`

---

### ➤ Get Single Doctor

`GET /api/doctors/<id>/`

---

### ➤ Update Doctor

`PUT /api/doctors/<id>/`

---

### ➤ Delete Doctor

`DELETE /api/doctors/<id>/`

---

## 🔗 Patient-Doctor Mapping APIs

### ➤ Assign Doctor to Patient

`POST /api/mappings/`

---

### ➤ Get All Mappings

`GET /api/mappings/`

---

### ➤ Get Doctors for a Patient

`GET /api/mappings/<patient_id>/`

---

### ➤ Remove Mapping

`DELETE /api/mappings/<id>/`

---

## 🧪 API Testing Approach

Although the assignment is backend-focused, I ensured **thorough API testing in two ways**:

### ✅ 1. Postman Testing

* All endpoints were tested with proper request/response validation
* JWT tokens were used for protected routes

### ✅ 2. Custom Frontend Interface

* Built a lightweight UI to interact with APIs in real-time
* Helps simulate real-world usage
* Demonstrates full flow:

  * Register → Login
  * Create Patients & Doctors
  * Assign Doctors to Patients

---

## 🎥 Demo Explanation

A **separate demo video** is included that clearly demonstrates:

* Complete API flow
* Authentication handling
* CRUD operations
* Mapping functionality
* Real-time interaction using frontend

---

## ✅ Assignment Requirements Coverage

| Requirement               | Status                      |
| ------------------------- | --------------------------- |
| Django + DRF Backend      | ✅ Completed                 |
| PostgreSQL Integration    | ✅ Implemented               |
| JWT Authentication        | ✅ Secure & Functional       |
| RESTful APIs              | ✅ All endpoints implemented |
| Patient Management        | ✅ Full CRUD                 |
| Doctor Management         | ✅ Full CRUD                 |
| Mapping System            | ✅ Implemented               |
| Authentication Protection | ✅ Applied                   |
| Error Handling            | ✅ Included                  |
| Environment Variables     | ✅ Used                      |
| API Testing               | ✅ Postman + Frontend        |

---

## 🏗️ Project Structure (Clean & Scalable)

* Modular apps (Auth, Patients, Doctors, Mapping)
* Separation of concerns
* Reusable serializers and views
* API-first design

---

## 💡 Final Notes

This project was built with a **backend-first mindset**, ensuring:

* Clean architecture
* Secure authentication
* Scalable database design
* Real-world usability

The additional frontend and demo video were included to make the system **easy to test, understand, and evaluate**.

---

## 🚀 Thank You

Looking forward to your feedback!
