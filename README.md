System Design URL Shortener:
This project is a full-stack, production-ready URL shortener built on the core system design principles. It is designed to handle high-volume read traffic efficiently by leveraging a centralized unique ID generator, Base62 encoding, and a strict caching layer.

Architectural Highlights & Concepts:
This application implements several foundational distributed system patterns to guarantee performance and reliability at scale.

High-Performance Read Path:
Read queries drastically outnumber write operations in a typical URL shortener. To protect the primary database and maintain low-latency responses, the system implements a cache-aside pattern. Inbound traffic hits the caching layer first. Database queries only occur on a cache miss, and successful lookups are immediately written back to the cache.

Base62 Encoding via Unique IDs:
Instead of hashing raw URLs (which frequently triggers hash collisions that require database lookup loops), this system treats shortening as a math problem.
    Every new URL receives a globally unique, auto-incrementing integer ID.
    This integer is converted to a character string using a Base62 alphabet (0-9, a-z, A-Z).
    A 64-bit integer scales down into a highly compact, 7-character string capable of representing trillions of unique URLs.

Intelligent HTTP Redirection:
The redirection endpoint issues explicit HTTP response codes based on analytics needs. It utilizes permanent redirects for maximum edge caching and temporary redirects where click tracking, user-agent analytics, and geolocation metrics are strictly required.

Tech Stack:
Backend:
Node.js & Express: Forms the core API layer, handling routing, middleware authentication, and business logic execution.
PostgreSQL: Acts as the single source of truth. It stores the critical mappings between the generated numeric IDs, the shortened Base62 strings, and the target destination URLs.Redis: Deployed as an in-memory data structure store to act as the high-speed caching tier directly in front of PostgreSQL.

Frontend:
React: Drives the user interface, providing a smooth, single-page application experience for URL submission and history tracking.
Tailwind CSS: Utilized for utility-first styling to ensure a clean, responsive UI layout that adapts seamlessly to desktop and mobile displays.

API References:

Shorten a URL:
Endpoint: POST /api/v1/data/shorten
Payload: { "longUrl": "https://example.com" }
Response: { "shortUrl": "http://localhost:3000/b9X2z" }

Redirect an Alias:
Endpoint: GET /:shortUrl
Action: Checks Redis/PostgreSQL for the key mapping. If found, returns an HTTP redirect response sending the browser to the original destination.

Local Setup:

Option 1: 
Docker Compose (Recommended)
This approach automatically provisions and connects the application servers, PostgreSQL database, and Redis cache with a single command.
Prerequisites
Docker installed on your machine
Docker Compose installed on your machine

Installation Steps
Clone the repository to your local environment.
Open a terminal at the root directory of the project.
Create a .env file based on the provided template to configure your environment variables.
Run the command docker-compose up --build.Open your browser and navigate to http://localhost:3000 to access the application.


Option 2: Manual Installation
Prerequisites
Ensure you have Node.js, PostgreSQL, and Redis Server installed and running locally on your machine.
Installation Steps
Clone the repository to your local environment.
Navigate to the backend directory, install the server dependencies, configure your environment variables (database credentials, Redis connection string, and server port), and start the application server.
Open a separate terminal window, navigate to the frontend directory, install the client-side dependencies, and boot the development server to launch the interface in your browser.