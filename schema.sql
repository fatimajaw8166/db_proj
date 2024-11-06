-- Customer Entity
CREATE TABLE Customer (
    CustomerID INT PRIMARY KEY,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    Email VARCHAR(100),
    Phone VARCHAR(15),
    LicenseNumber VARCHAR(20),
    Address VARCHAR(255)
);

-- Car Entity
CREATE TABLE Car (
    CarID INT PRIMARY KEY,
    Make VARCHAR(50),
    Model VARCHAR(50),
    Year INT,
    LicensePlate VARCHAR(20),
    Status VARCHAR(20),
    BranchID INT,
    FOREIGN KEY (BranchID) REFERENCES Branch(BranchID)
);

-- Rental Entity
CREATE TABLE Rental (
    RentalID INT PRIMARY KEY,
    CustomerID INT,
    CarID INT,
    EmployeeID INT,
    RentalDate DATE,
    ReturnDate DATE,
    TotalAmount DECIMAL(10, 2),
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID),
    FOREIGN KEY (CarID) REFERENCES Car(CarID),
    FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID)
);

-- Payment Entity
CREATE TABLE Payment (
    PaymentID INT PRIMARY KEY,
    RentalID INT,
    PaymentDate DATE,
    Amount DECIMAL(10, 2),
    PaymentMethod VARCHAR(50),
    FOREIGN KEY (RentalID) REFERENCES Rental(RentalID)
);

-- Employee Entity
CREATE TABLE Employee (
    EmployeeID INT PRIMARY KEY,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    Email VARCHAR(100),
    Phone VARCHAR(15),
    Position VARCHAR(50),
    BranchID INT,
    FOREIGN KEY (BranchID) REFERENCES Branch(BranchID)
);

-- Branch Entity
CREATE TABLE Branch (
    BranchID INT PRIMARY KEY,
    BranchName VARCHAR(100),
    Address VARCHAR(255),
    Phone VARCHAR(15)
);

-- Reservation Entity
CREATE TABLE Reservation (
    ReservationID INT PRIMARY KEY,
    CustomerID INT,
    CarID INT,
    ReservationDate DATE,
    Status VARCHAR(20),
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID),
    FOREIGN KEY (CarID) REFERENCES Car(CarID)
);

-- Maintenance Entity
CREATE TABLE Maintenance (
    MaintenanceID INT PRIMARY KEY,
    CarID INT,
    MaintenanceDate DATE,
    Description TEXT,
    Cost DECIMAL(10, 2),
    FOREIGN KEY (CarID) REFERENCES Car(CarID)
);

-- Insurance Entity
CREATE TABLE Insurance (
    InsuranceID INT PRIMARY KEY,
    CarID INT,
    Provider VARCHAR(100),
    PolicyNumber VARCHAR(50),
    ExpiryDate DATE,
    FOREIGN KEY (CarID) REFERENCES Car(CarID)
);

-- Feedback Entity
CREATE TABLE Feedback (
    FeedbackID INT PRIMARY KEY,
    CustomerID INT,
    RentalID INT,
    FeedbackDate DATE,
    Comments TEXT,
    Rating INT,
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID),
    FOREIGN KEY (RentalID) REFERENCES Rental(RentalID)
);