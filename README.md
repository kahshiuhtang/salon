# Salon

Customer Management System for Nail Salons, designed with input from SNS Nail Salon in Staten Island, New York.

### Main Features

Here are some of the functionality that was asked to be implemented by staff from SNS Nails.

* Method to search through and filter all existing customers

* Method to schedule appointments

* Method to view appointments that were occurring on a specific day

* Method to allow customers to easily put what their availability was

* Method to handle pricing of services

* Method to allow for easy rescheduling of appointments

### Images

##### Landing Page

This page allows users who are not logged in to search for services and check out the nail salon. Clicking on services allows users to see what services and goods are sold at this salon. Admins are allowed to edit the prices and times of goods and services; they can also create and delete these items.

![Alt text](images/landing.png "Landing Page")

##### Home Page

This is the main dashboard that all users will hit when they have logged in. It gives a card and calendar view of what appointments have occurred and what is going to occur.

![Alt text](images/home.png "Home Page")

##### Booking Page

This is a simple form to allow users to add as many services as they want and who they want to carry out said services. It can scale to include as many services as needed.

![Alt text](images/book.png "Booking Page")

##### Settings Page

Users are allowed to set their schedule, and update information and availabilities to improve the back-and-form process of scheduling appointments.

![Alt text](images/settings.png "Settings Page")

##### Users Page

Here, administrators can search through users, and see their preferences and their history. There are different colors for different roles of people: Users can also be promoted/demoted on this page. Most importantly, it allows for admins to see the availability of their customers.

![Alt text](images/users.png "Users Page")

##### Appointments Page

Here, employees can change and verify appointments so see what status each appointment is on. An employee can filter by things such as name and date. A user can also view their appointments here, but it is mainly to see if any of their requests for an appointment have been confirmed.

![Alt text](images/appointments.png "Appointments Page")


### Dependencies

1. pnpm
2. ReactJS
3. Maven, Java 22

### To Run

1. Frontend

```bash
cd salon-frontend

pnpm install

pnpm run
```

2. Backend

```bash
cd salon-backend

./scripts/install-services.sh

make all
```