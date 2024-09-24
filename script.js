let totalPoints = 0;

function updatePoints(points) {
    totalPoints += points;
    document.getElementById('pointsDisplay').textContent = totalPoints;
}

function claimReward() {
    let message = '';
    if (totalPoints >= 100) {
        message = "Congratulations! You've earned a certificate!";
    } else {
        message = `You need ${100 - totalPoints} more points to earn a certificate.`;
    }
    document.getElementById('rewardMessage').textContent = message;
}
