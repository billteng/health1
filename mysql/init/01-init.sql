CREATE DATABASE IF NOT EXISTS patientdb;
USE patientdb;

CREATE TABLE IF NOT EXISTS patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE,
  status ENUM('Inquiry','Onboarding','Active','Churned') DEFAULT 'Inquiry',
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
