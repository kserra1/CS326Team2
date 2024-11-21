express = require('express');
port = 3000;    
app = express();

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
    });

