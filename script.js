function initFirebaseAndFetchData() {
    // Check if Firebase is loaded
    if (typeof firebase !== 'undefined') {
        // Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyAmwFGPUbQvpI7pdnk_CL91G3FTMiHF-BE",
            authDomain: "kdatracker-d3c35.firebaseapp.com",
            databaseURL: "https://kdatracker-d3c35-default-rtdb.firebaseio.com",
            projectId: "kdatracker-d3c35",
            storageBucket: "kdatracker-d3c35.appspot.com",
            messagingSenderId: "136263581659",
            appId: "1:136263581659:web:c78b7d31dd313af8f0f1fe"
        };

        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        const db = firebase.database();

        function updateLeaderboard(snapshot) {
            const leaderboardTable = document.getElementById('leaderboard').getElementsByTagName('tbody')[0];
            const oldRows = leaderboardTable.querySelectorAll('tr'); // Get existing rows
            leaderboardTable.innerHTML = ''; // Clear previous data

            // Collect data in an array and sort it manually in descending order by kills
            const data = [];
            snapshot.forEach(childSnapshot => {
                data.push(childSnapshot.val());
            });

            // Sort the data by kills in descending order
            data.sort((a, b) => b.kills - a.kills);

            let rank = 1;
            data.forEach(playerData => {
                if (playerData && playerData.player !== undefined && playerData.kills !== undefined && playerData.deaths !== undefined) {
                    const row = leaderboardTable.insertRow();
                    row.innerHTML = `
                        <td>${rank}</td>
                        <td>${playerData.player}</td>
                        <td>${playerData.kills}</td>
                        <td>${playerData.deaths}</td>
                    `;
                    
                    // Check if this row was updated
                    const oldRow = Array.from(oldRows).find(oldRow => {
                        const cells = oldRow.children;
                        return cells[1].innerText === playerData.player;
                    });

                    if (oldRow) {
                        const oldKills = parseInt(oldRow.children[2].innerText, 10);
                        const oldDeaths = parseInt(oldRow.children[3].innerText, 10);
                        const killsCell = row.children[2];
                        const deathsCell = row.children[3];

                        if (playerData.kills !== oldKills) {
                            killsCell.classList.add('highlight-kills');
                            setTimeout(() => killsCell.classList.remove('highlight-kills'), 2000);
                        }

                        if (playerData.deaths !== oldDeaths) {
                            deathsCell.classList.add('highlight-deaths');
                            setTimeout(() => deathsCell.classList.remove('highlight-deaths'), 2000);
                        }
                    }

                    rank++;
                } else {
                    console.warn('Missing fields in playerData:', playerData);
                }
            });
        }

        // Listen for changes in the leaderboard data and order by 'kills'
        const leaderboardRef = db.ref('leaderboard');
        leaderboardRef.on('value', snapshot => {
            updateLeaderboard(snapshot);
        });

    } else {
        console.error('Firebase SDK not loaded.');
    }
}

// Wait for DOM content to be fully loaded before initializing Firebase
document.addEventListener('DOMContentLoaded', initFirebaseAndFetchData);
