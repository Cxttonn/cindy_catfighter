<?php
date_default_timezone_set("Asia/Bangkok");
require "connection.php";

// SQL query to select data from the table
$sql = "SELECT id, temperature, humidity, timestamp FROM table1 ORDER BY timestamp DESC";

// Execute the query
$result = mysqli_query($conn, $sql);

if ($result) {
    // Check if there are any results
    if (mysqli_num_rows($result) > 0) {
        // Output data of each row
        echo "<table border='1'>
                <tr>
                    <th>ID</th>
                    <th>Temperature</th>
                    <th>Humidity</th>
                    <th>Timestamp</th>
                </tr>";

        while ($row = mysqli_fetch_assoc($result)) {
            echo "<tr>
                    <td>{$row['id']}</td>
                    <td>{$row['temperature']}</td>
                    <td>{$row['humidity']}</td>
                    <td>{$row['timestamp']}</td>
                  </tr>";
        }
        
        echo "</table>";
    } else {
        echo "No records found.";
    }
} else {
    echo "Error: " . mysqli_error($conn);
}

// Close the database connection
mysqli_close($conn);
?>
