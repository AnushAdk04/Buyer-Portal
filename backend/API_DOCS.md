# BuyerPortal API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/auth/register` | `POST` | Register a new user |
| `/auth/login` | `POST` | Login and get cookie |
| `/auth/logout` | `POST` | Logout |
| `/auth/me` | `GET` | Get current user info |

## Properties

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/properties` | `GET` | List properties with filters |
| `/properties/:id` | `GET` | Get property details |
| `/properties` | `POST` | Create a property (Multipart/Form-Data) |
| `/properties/:id` | `PUT` | Update a property |
| `/properties/:id` | `DELETE` | Delete a property |
| `/search` | `GET` | Advanced search |

## Favourites

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/favourites` | `GET` | Get user's favourite properties |
| `/favourites` | `POST` | Add to favourites |
| `/favourites/:id` | `DELETE` | Remove from favourites |

## Inquiries

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/inquiries` | `GET` | Get user's inquiries |
| `/inquiries` | `POST` | Submit an inquiry |

## Analytics (Sellers Only)

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/users/analytics` | `GET` | Get view stats for listings |

## Notifications

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/notifications` | `GET` | Get user notifications |
| `/notifications/:id/read` | `PUT` | Mark notification as read |
| `/notifications/read-all` | `PUT` | Mark all notifications as read |
