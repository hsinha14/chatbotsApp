$(document).ready(function() {
   var client = new ApiAi.ApiAiClient({accessToken: '3f0599b90f524d4ab2cfa704e501d105', streamClientClass: ApiAi.ApiAiStreamClient}),
      recognizing,
      button=$("#button"),
      recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      reset();
      recognition.onend = reset();

   function getResponse(query) {
      let promise = client.textRequest(query);
      promise
      .then(handleResponse)
      .catch(heandleError);

      function handleResponse(serverResponse) {
         document.getElementById("resultDiv").innerHTML=JSON.stringify(serverResponse.result.fulfillment.speech);
         var messageArray=serverResponse.result.fulfillment.messages[1],
            jsonString;
         if (messageArray === undefined) {
            $("#mainImage").addClass("hide").removeClass("show");
            jsonString="";
         } else {
            $("#mainImage").addClass("show").removeClass("hide");
            jsonString=JSON.stringify(messageArray["imageUrl"]);
            jsonString=jsonString.slice(0, -1).slice(1);
         }
         document.getElementById("mainImage").src=jsonString;
      }

      function heandleError(serverError) {
         console.log(serverError);
      }
   }

   recognition.onresult = function (event) {
      for (var i = event.resultIndex; i < event.results.length; ++i) {
         if (event.results[i].isFinal) {
            textarea.value += event.results[i][0].transcript;
         }
      }
   }

   function reset() {
      recognizing = false;
      button.text("Click to Speak");
   }

   function toggleStartStop() {
      if (recognizing) {
         recognition.stop();
         reset();
      } else {
         recognition.start();
         recognizing = true;
         button.text("Click to Speak");
      }
   }

   $("#template").on('keydown','#textarea',function(event){
      if (event.keyCode == 13) {
         var sendquery=$(event.target).val();
         getResponse(sendquery);
      }
   });
   $('#template').on('click','#submitQuery',function(){
      var sendquery= $("#textarea").val();
      getResponse(sendquery);
   });
   $("#template").on('click','#button',function(){
      toggleStartStop();
   });

});
