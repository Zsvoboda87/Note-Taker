const path = require('path');
const router = require('express').Router();
const fs = require('fs');
const uuid = require('../../helpers/uuid');




router.get("/api/notes", (req, res) => {

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // Convert string into JSON object
      const parsedNotes = JSON.parse(data);

      res.json(parsedNotes);
    }
  });
});

router.post("/api/notes", (req, res) => {

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    // Obtain existing reviews
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(data);

        // Add a new review
        parsedNotes.push(newNote);

        // Write updated reviews back to the file
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Successfully updated reviews!')
        );
      }
    });

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.json(response);
  } else {
    res.json('Error in posting review');
  }

});

router.delete("/api/notes/:id", (req, res) => {
  const incomingID = req.params.id
  console.log(incomingID)


  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedNotes = JSON.parse(data)

      for (i = 0; i < parsedNotes.length; i++) {
        console.log(parsedNotes[i].id)
        if (parsedNotes[i].id == incomingID) {
          parsedNotes.splice(i, 1);
          console.log(parsedNotes)

          fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedNotes, null, 4),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated reviews!')
          );
        }
      }
    }
  });

  const response = {
    status: 'success',
  };

  console.log(response);
  res.json(response);

});


module.exports = router;
