# startup

## Startup Specification Assignment

#### Elevator Pitch

Often times when I go on vacation and stay at a vacation rental like Airbnb or Vrbo with my family, we end up having to stop at some grocery store nearby in order to stock up on the food we need for the time period.  This is such a hassle and takes away from the essense of vacation: **relaxation**. I've got an idea for an application that allows for owners of Vacation Rentals to allow their temporary tenants to get the vacation rental stocked with the groceries they need prior to their arrival.  This would be better than a simple delivery service because the desired food would be inside the vacation rental, in the refrigerator or cabinets, upon arrival.  Talk about getting right to vacationing!  

#### Key Features

The application will include the ability for the vacation rental owner to register their vacation rental on the application and their tenants to be able to customize an order to be delivered and stocked in the rental.  The tenant will get updated when the food has been stocked with a photo of what has been stocked.  Tenants can leave a review on the vacation rental stocking experience.

#### Technology Use
    
The app will include *Authentication* because Owners will be able to register their vacation rental on the service, while tenants will be able to create an account and customize their order.  The app will include *Database data* with its storage of vacation rental addresses as well as customer orders.  The app will include *Websocket data* by updating the tenants of the delivery status.

#### Design Images

![Design Image First Page](/images/AireStockSketch1.png)
![Design Image Second Page](/images/AireStockSketch2.png)

## HTML Deliverable

- **HTML Pages** - 8 HTML pages. Ability to login, sign up, or register your vacation rental. Ability to place an order, recieve an order, and update delivery status.  Choose vacation rental company.
- **Links** - Links to sign in page, sign up page, registration page, as well as a page that links to a variety of vacation rentals.
- **Text** - Text representing food options and delivery status.  Orders on the Vacation Rental Owner end.
- **DB/Login** - Several inputs for and a button for login capabilities.  Orders are placed into a database, which is displayed on the VR Owner end.
- **WebSocket** - The orders and delivery status are updated in realtime.


## CSS Deliverable

- Each of the following is properly styled: **Header, footer, and main content body**
- **Navigation elements** - I created a cool hovering style to my navbar
- **Responsive to window resizing** - My app looks good on all size windows
- **Application Elements** - Elements are styled in a consistent and sleek way.
- **Application Text Content** - Fonts are consistent and listed preferred similar fonts based on availability
- **Application Images** - Images, specifically on VRcompanies.html page, are styled

## JavaScript Deliverable

- **login** - On the Home page, when you type in an address, and press select, it will direct you to the renterFoodOptions page.  When you register your vacation rental, it takes you to the orders page.  If you sign in with correct credentials, it will take you to the orders page associated with that account.
- **database** - Displayed Address for Home page address sign in.  Displays Name and Address for user that registers.  Currently stored and retrieved from local storage, but will be replaced with database data later.
- **WebSocket** - I used the setTimeout function to delay the reception of an order on the orders page.  I used the setTimeout function to delay the deliver status updates on the deliveryStatus page.
- **application logic** - On the orders page, the order changes based on the user's selection. Send Order button brings user to the deliverStatus page.

## Service Deliverable

For this deliverable I added backend enpoints that receive orders associated with an address, and returns displays returns that order to the rental owner associated with that address.

 - **Node.js/Express HTTP service** - DONE
 - **Static middleware for frontend** - DONE
 - **Calls to third party endpoints** - I've implemented the google places api that autofills addresses on each page that required entering an address.  I also implemented a grocery api in my renterFoodOptions page.
 - **Backend service endpoints** - Placeholders for login that stores the current user on the server.  Endpoints for orders.
 - **Frontend calls service endpoints** - I used the fetch function