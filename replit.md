# Overview

VetCare Chile is a modern web application for veterinary home services in Santiago, Chile. The platform provides a comprehensive solution for managing veterinary consultations, medical records, vaccinations, certificates, and exam requests through three main interfaces: a public landing page, a professional portal for veterinarians, and a client portal for pet owners. The application combines a React-based frontend with a Node.js/Express backend, utilizing Drizzle ORM for database management and Firebase for authentication and file storage.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend is built using React with TypeScript and follows a component-based architecture:

- **Framework**: React 18 with TypeScript for type safety
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom color variables for consistent branding (mint, lavender, turquoise, pale rose, warm beige)
- **UI Components**: Radix UI components with shadcn/ui styling system
- **State Management**: TanStack Query for server state management
- **Forms**: React Hook Form with Zod validation

The application uses a modular structure with three main views:
- Public homepage with service information and booking integration
- Professional portal for veterinarians to manage patient records and generate exam orders
- Owner portal for pet owners to view their pets' medical history

## Backend Architecture

The backend follows a layered architecture pattern:

- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Firebase Auth for user management
- **File Storage**: Firebase Storage for document and image handling
- **Development**: Vite for development server and hot module replacement

The database schema includes tables for users, pets, medical records, and vaccinations with proper foreign key relationships. The storage layer provides a clean interface for CRUD operations with both in-memory and database implementations.

## Authentication and Authorization

Firebase Authentication handles user management with role-based access:
- **Veterinarians**: Full access to create and edit medical records, generate certificates
- **Pet Owners**: Read-only access to their pets' records and documents
- **Public Users**: Access to landing page and booking functionality

## Design System

The application implements a cohesive design system:
- **Typography**: Poppins for headings, Lato for body text
- **Colors**: Custom CSS variables for brand colors (mint, lavender, turquoise, pale rose, warm beige)
- **Components**: Reusable UI components with consistent styling
- **Responsive Design**: Mobile-first approach with Tailwind CSS breakpoints

# External Dependencies

## Firebase Services

- **Firebase Auth**: User authentication and authorization
- **Firebase Firestore**: Document storage for flexible data structures
- **Firebase Storage**: File storage for PDFs, images, and certificates

## Database

- **PostgreSQL**: Primary database for structured data
- **Neon Database**: Serverless PostgreSQL provider (based on connection string pattern)
- **Drizzle ORM**: Type-safe database operations and migrations

## UI and Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Headless UI components for accessibility
- **shadcn/ui**: Pre-styled component library
- **Lucide React**: Icon library
- **Font Awesome**: Additional icons for branding

## Development Tools

- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the application
- **TanStack Query**: Server state management and caching
- **Wouter**: Lightweight routing library

## External Integrations

- **Calendly**: Appointment booking integration for the public website
- **Chilean Vaccine Database**: Autocomplete functionality for local vaccine brands (Zoetis, MSD/Nobivac)
- **RUT Validation**: Chilean tax ID validation with modulo 11 algorithm
- **PDF Generation**: Document generation for certificates, prescriptions, and exam orders
- **Exam Request System**: Automated generation of medical orders with patient-specific instructions

## Recent Changes (January 2025)

- **WhatsApp Notification System**: Complete implementation of WhatsApp Business integration for client communications
- **Enhanced Exam System**: Expanded to 9 exam types across 5 categories (Hematología, Bioquímica, Microbiología, Patología, Diagnóstico por Imagen)
- **Professional Instructions**: Detailed preparation instructions, fasting requirements, and sample collection protocols for each exam type
- **Emergency Contact**: 24/7 emergency WhatsApp button with automatic message generation for urgent veterinary needs
- **Real Veterinarian Data**: Complete integration of Dra. Alejandra Cautín Bastías professional information from HTML source
- **Automated Notifications**: WhatsApp integration for exam reminders, appointment confirmations, result notifications, and vaccination reminders
- **Client Communication**: Multi-channel notification system allowing veterinarians to send professional communications via WhatsApp
- **Enhanced Database Schema**: Added comprehensive client fields including RUT validation, emergency contacts, and medical history tracking

## WhatsApp Integration Features

- **Exam Reminders**: Automatic generation of detailed preparation instructions via WhatsApp
- **Appointment Confirmations**: Professional appointment confirmation messages with veterinarian details
- **Results Notifications**: Automated alerts when exam results are ready for client review
- **Vaccination Reminders**: Scheduled vaccination reminders with detailed vaccine information
- **Emergency Contacts**: 24/7 emergency WhatsApp integration with direct veterinarian contact
- **Custom Messages**: Flexible message system for personalized client communications

The architecture now includes full WhatsApp Business API integration supporting Chilean phone number formatting and professional veterinary communication templates.