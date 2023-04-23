module.exports = async function (context, req, doc) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // Initialize an empty array to hold the names
    let names_list = [];

    // Loop through each resume and append the name to the array
    doc.forEach(resume => {
        names_list.push(resume.name);
    });

    // Select a random value from the array
    let random_value = names_list[Math.floor(Math.random() * names_list.length)];

    // Set the headers to allow cross-origin requests
    let headers = {
        'Access-Control-Allow-Origin': '*',  // replace * with your domain name
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Return the random value as an HTTP response
    context.res = {
        headers: headers,
        status: 200,
        body: random_value
    };
};
