var web3 = new Web3(Web3.givenProvider);

$(document).ready(function() {
    window.ethereum.enable().then(function(accounts){ // window.ethereum.enable brings up the Metamask prompt in the webpage.
      contractInstance=new web3.eth.Contract(abi, "0x62E2fF8FbCFa57149c129fd8d66741ABe3735529", {from: accounts[0]}); //This creates an instance of a contract, the argument abi is the functions and variables therein (see abi.js), the second argument is the contract address, as a string. Finally, the third specifies the sender for the contract.
      console.log(contractInstance);
    });

    //$("#balance_output").html(getBalance);
    //$(window).on("load",fetchAndDisplay) //can I do this?
    $("#place_bet_button").click(placeBet)
    $("#top_up_button").click(topUp)
    //*fetchAndDisplay()
});



function fetchAndDisplay(){
  contractInstance.methods.getBalance().call().then(function(res){
    console.log(res);
    $("#balance_output").text(res/1000000000000000000 + " ETH");
  });
}

function placeBet(){
  var bet=$("#bet_input").val();

  //bet = 10;

  var config = {
    value: web3.utils.toWei(String(bet),"ether")
  }

  contractInstance.methods.flip().send(config)
  .on("receipt", function(receipt){
    console.log(receipt.events.betPlaced.returnValues[0])
    var message=receipt.events.betPlaced.returnValues[0];
    var balance=receipt.events.betPlaced.returnValues[1];
    $("#result_output").text(message);
    $("#balance_output").text(balance/1000000000000000000 + " ETH");
  })
  .on('transactionHash', function(hash){
    console.log(hash);
    $("#result_output").text("Bet Placed");
//    fetchAndDisplay();
  })
  //.on("transactionHash",function(hash){ //These are different listeners that will trigger when they happen. 'hash' is transaction hash...
  //  console.log(hash);
  //})

//contractInstance.events.betPlaced({
//    fromBlock:0
//}, function(error, event){
//  console.log(event);
//})

}

function topUp(){
  var topUp=$("#top_up_input").val();

  var config = {
    value: web3.utils.toWei(String(topUp),"ether")
  }

contractInstance.methods.loadContract().send(config)
.on('transactionHash', function(hash){
    console.log("Contract loaded");
    $("#result_output").text("Top-up successful");
    fetchAndDisplay()
  })
  .on('receipt', function(receipt){
    var balance=receipt.events.load.returnValues[1];
    $("#balance_output").text(balance/1000000000000000000 + " ETH");
  })
}
