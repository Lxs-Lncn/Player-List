document.addEventListener("DOMContentLoaded", function () {
    const playerNameInput = document.getElementById("player-name");
    const playerRoleSelect = document.getElementById("player-role");
    const addPlayerButton = document.getElementById("add-player-btn");
    const paymentModal = document.getElementById("payment-modal");
    const confirmPaymentButton = document.getElementById("confirm-payment");
    const cancelPaymentButton = document.getElementById("cancel-payment");
    const paymentRefSpan = document.getElementById("payment-ref");

    let pendingPlayer = null;
    let paymentRef = "";
    const cancelRegistrationButton = document.getElementById("cancel-registration-btn");
    const cancelWarning = document.getElementById("cancel-warning");
    const shuffleButton = document.getElementById("shuffle-btn");

    // Handle Enter key press
    playerNameInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();  // Prevent the default action (form submit)
            addPlayerButton.click();  // Trigger the add player button
        }
    });

    // Add player on "Register & Pay" button click
    addPlayerButton.addEventListener("click", function () {
        const name = playerNameInput.value.trim();
        const role = playerRoleSelect.value;
        if (name === "") return alert("Please enter your name.");

        // Generate Reference Number
        pendingPlayer = { name, role };
        paymentRef = generateReferenceNumber();
        paymentRefSpan.textContent = paymentRef;
        paymentModal.style.display = "block";
    });

    // Confirm payment and add player if payment is successful
    confirmPaymentButton.addEventListener("click", async function () {
        if (!pendingPlayer) return;

        // Simulate payment verification (replace with actual payment verification)
        const isPaid = await verifyPayment(paymentRef);

        if (isPaid) {
            // Add the player if payment is successful
            const listId = `${pendingPlayer.role.replace(/\s/g, "")}-list`;
            const listElement = document.querySelector(`#${listId} ul`);
            const listItem = document.createElement("li");
            listItem.textContent = pendingPlayer.name;
            listElement.appendChild(listItem);

            alert("Payment successful! You have been registered.");
            pendingPlayer = null;
            paymentModal.style.display = "none"; // Hide modal
            playerNameInput.value = ""; // Clear input
        } else {
            alert("Payment not received. Please complete the payment first.");
        }
    });

    // Cancel payment and reset modal
    cancelPaymentButton.addEventListener("click", function () {
        pendingPlayer = null;
        paymentModal.style.display = "none"; // Hide modal
    });

    // Show cancellation warning when clicking on the cancel registration button
    cancelRegistrationButton.addEventListener("click", function () {
        cancelWarning.style.display = "block";
        setTimeout(() => cancelWarning.style.display = "none", 5000); // Hide the warning after 5 seconds
    });

    // Shuffle function to randomize the players in the lists
    shuffleButton.addEventListener("click", function () {
        const allPlayers = [];
        const roles = ["Setter", "Pick 1", "Pick 2", "Pick 3", "Pick 4", "Pick 5"];

        roles.forEach(role => {
            const roleList = document.querySelector(`#${role.replace(/\s/g, "")}-list ul`);
            const players = Array.from(roleList.children);
            players.forEach(player => allPlayers.push({ name: player.textContent, role }));
            roleList.innerHTML = ''; // Clear the original list
        });

        // Shuffle the players and add them back to random roles
        allPlayers.sort(() => Math.random() - 0.5);
        allPlayers.forEach(player => {
            const roleList = document.querySelector(`#${player.role.replace(/\s/g, "")}-list ul`);
            const listItem = document.createElement("li");
            listItem.textContent = player.name;
            roleList.appendChild(listItem);
        });
    });

    // Generate Reference Number
    function generateReferenceNumber() {
        return "PAY-" + Math.floor(Math.random() * 1000000);
    }

    // Simulate payment verification (this should be replaced with an actual payment gateway)
    function verifyPayment(ref) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(true); // Simulating payment success
            }, 2000);
        });
    }
});

// Extract query parameters from the URL
const urlParams = new URLSearchParams(window.location.search);

// Get individual parameters
const eventDate = urlParams.get('eventDate');
const startTime = urlParams.get('startTime');
const endTime = urlParams.get('endTime');
const location = urlParams.get('location');
const callTime = urlParams.get('callTime');
const perHeadFee = urlParams.get('perHeadFee');
const lateFee = urlParams.get('lateFee');
const organizer = urlParams.get('organizer');

// Display the event details (example)
document.getElementById('event-details').innerHTML = `
    <h3>Event Details</h3>
    <p>Date: ${eventDate}</p>
    <p>Time: ${startTime} - ${endTime}</p>
    <p>Location: ${location}</p>
    <p>Call Time: ${callTime}</p>
    <p>Fee: $${perHeadFee} per person</p>
    <p>Late Fee: $${lateFee}</p>
    <p>Organizer: ${organizer}</p>
`;

// Function to get query parameters from the URL
function getQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        date: urlParams.get('date'),
        startTime: urlParams.get('start_time'),
        endTime: urlParams.get('end_time'),
        location: urlParams.get('location'),
        callTime: urlParams.get('call_time'),
        perHead: urlParams.get('per_head'),
        lateFee: urlParams.get('late_fee'),
        organizer: urlParams.get('organizer')
    };
}

window.addEventListener('DOMContentLoaded', () => {
    // Retrieve parameters from URL
    const params = new URLSearchParams(window.location.search);
    document.getElementById('event-date').textContent = params.get('eventDate');
    document.getElementById('start-time').textContent = params.get('startTime');
    document.getElementById('end-time').textContent = params.get('endTime');
    document.getElementById('location').textContent = params.get('location');
    document.getElementById('call-time').textContent = params.get('callTime');
    document.getElementById('per-head').textContent = params.get('perHead');
    document.getElementById('late-fee').textContent = params.get('lateFee');
    document.getElementById('organizer').textContent = params.get('organizer');
});

document.addEventListener("DOMContentLoaded", function () {
    const qrCode = localStorage.getItem("qrCode");
    if (qrCode) {
        document.getElementById("qr-image").src = qrCode;
    } else {
        document.getElementById("qr-image").alt = "No QR Code uploaded.";
    }
});

document.getElementById("event-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const fileInput = document.getElementById("qr-upload");
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            localStorage.setItem("qrCode", e.target.result); // Store QR code in localStorage

            // Gumawa ng URL na may token
            const token = "e5gnQFav2LKC4fagismU"; // Palitan ng dynamic token kung kinakailangan
            const generatedLink = `https://yourwebsite.com/list?token=${token}`;
            
            // Ipakita ang modal
            document.getElementById("modal").style.display = "flex";

            // Hintayin ng 2.5 seconds bago i-redirect
            setTimeout(function() {
                window.location.href = generatedLink;
            }, 2500);
        };
        reader.readAsDataURL(file);
    } else {
        alert("Please upload a QR code first.");
    }
});

// Function to get query parameters
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Kunin ang token mula sa URL
const token = getQueryParam("token");

if (token) {
    console.log("Token received:", token);
    // Dito mo pwede gamitin ang token (e.g., ipakita sa page)
} else {
    console.log("No token found in URL.");
}
