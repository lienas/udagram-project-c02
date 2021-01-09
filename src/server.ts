import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

    // Init the Express application
    const app = express();

    // Set the network port
    const port = process.env.PORT || 8082;

    //init the fetch-api
    const fetch = require("node-fetch");

    // Use the body parser middleware for post requests
    app.use(bodyParser.json());

    // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
    // GET /filteredimage?image_url={{URL}}
    // endpoint to filter an image from a public url.
    // IT SHOULD
    //    1  validate the image_url query
    //    2. call filterImageFromURL(image_url) to filter the image
    //    3. send the resulting file in the response
    //    4. deletes any files on the server on finish of the response
    // QUERY PARAMATERS
    //    image_url: URL of a publicly accessible image
    // RETURNS
    //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

    app.get("/filteredimage/", async (req:Request, res:Response) => {

        let image_url:String= req.query.image_url;
        //check if url was submitted
        if (!image_url) {
            return res.status(400)
                .send('url is required')
        }

        //check if url is correct
        let response: Response = null;
        try {
            response = await fetch(image_url);
        } catch (e) {
            console.log(e.message);
            return res.sendStatus(500);
        }

        if (response.status != 200) {
            res.status(response.status).send('Please check the url: ' + image_url)
        }

        //get the image
        let imageFromURL = await filterImageFromURL(image_url);

        //return the image
        res.status(200).sendFile(imageFromURL, () =>
            deleteLocalFiles([imageFromURL])
        );

    });

    /**************************************************************************** */

    //! END @TODO1

    // Root Endpoint
    // Displays a simple message to the user
    app.get("/", async (req, res) => {
        res.send("try GET /filteredimage?image_url={{}}")
    });


    // Start the Server
    app.listen(port, () => {
        console.log(`server running http://localhost:${port}`);
        console.log(`press CTRL+C to stop server`);
    });
})();
