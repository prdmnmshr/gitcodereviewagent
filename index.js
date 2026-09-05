const express = require('express');
const app = express();
const PORT = 8080

app.get('/',(req,res)=>{
    res.send('hello world is working fine')

});
app.post('/webhook',(req,res)=>{
    res.status(200).json({
        message: " webhook received successfully"
    })

})

app.listen(PORT, ()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
});