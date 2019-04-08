export const readTextFile = file => new Promise((resolve, reject) => {
    var rawFile = new XMLHttpRequest()
    rawFile.open("GET", file, true); // using synchronous call
    
    rawFile.onreadystatechange = function ()
    {   
        if(rawFile.readyState === 4)
        {    
            if(rawFile.status === 200 || rawFile.status == 0)
            {       
                resolve(rawFile._url)  
            }
        }
    }
    rawFile.send(null)
})