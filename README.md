# ALL_STAR_TEAM

## Overview
ALL_STAR_TEAM is a modular full‑stack JavaScript application combining a Node.js backend with a scalable, static frontend.  
It is designed to be a clean, flexible starting point for modern web projects with strong separation of concerns and production‑friendly architecture.

--------------------------------------------------

## System Architecture (Conceptual)
Backend Server
|
|-- Routing Layer
|    Maps user requests to controller logic
|
|-- Controller Layer
|    Handles business logic and processes input
|
|-- Model Layer
|    Defines data structures and supports DB operations
|
|-- Middleware Layer
|    Authentication, logging, error handling, etc.
|
Static Frontend
Served directly from Node.js

--------------------------------------------------

## Folder Structure
ALL_STAR_TEAM
|
|-- config            App configuration and environment setup
|-- controllers       Core application logic responding to routes
|-- errors            Custom errors for clean failure handling
|-- middlewares       Reusable request processing logic
|-- models            Data schemas and persistence logic
|-- public            Static web files (HTML, CSS, JS)
|-- routes            Route definitions for all API endpoints
|-- index.js          Entry point launching the server
|-- package.json      Dependency and script management

--------------------------------------------------

## Installation & Setup

### Requirements
Node.js 14 or later
npm installed

### Steps
git clone https://github.com/Varunesh07/ALL_STAR_TEAM.git
cd ALL_STAR_TEAM
npm install

--------------------------------------------------

## Running the Application

### Development
npm run dev
Auto‑reloads when files change

### Production Mode
npm start

Default access:
http://localhost:PORT
(Check index.js for actual port value)

--------------------------------------------------

## How the Application Works (Execution Flow)

1. Server boots from index.js
2. Environment and config load
3. Middlewares attach to request pipeline
4. Routes direct traffic to controllers
5. Controllers use models if database interactions are needed
6. Responses or errors return to user

--------------------------------------------------


