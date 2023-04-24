document.addEventListener("DOMContentLoaded", () => {
  const point1 = "1"
  console.log(point1);
  async function getRandomMessage() {
    //const responseAPI = await fetch("https://rakhiresumefunction.azurewebsites.net/api/HttpTrigger1?");
    //const responseAPI = await fetch("http://localhost:8080/api/HttpTrigger1", { mode: "no-cors" });
    const responseAPI = await( await fetch(`/api/HttpTrigger1`));
    const data = await responseAPI.text();
    console.log(responseAPI);
    //const point2 = "2"
    //console.log(point2);
    return data;
  }

  const button = document.getElementById("get-random-message");
  const messageElement = document.getElementById("message");


  button.addEventListener("click", async () => {
  messageElement.textContent = "Loading...";
    try {
      const messagevalue = await getRandomMessage();
      console.log(messagevalue);
      messageElement.textContent = messagevalue;
    } catch (error) {
      console.error(error);
      messageElement.textContent = "Failed to fetch random message";
    }
  });

});

