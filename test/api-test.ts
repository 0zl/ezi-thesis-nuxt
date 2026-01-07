
import { Client } from "@gradio/client";

async function testApi() {
  try {
    console.log("Connecting to Gradio API...");
    const client = await Client.connect("https://gizi.ezii.my.id/");
    
    console.log("Calling analyze_gizi...");
    const result = await client.predict("/analyze_gizi", { 		
        nama: "Budi Test", 
        dob_str: "2024-01-06", 
        gender: "Laki-laki", 
        weight: 12.2, 
        height: 87.1, 
        measure_mode: "Berdiri", 
    });

    console.log("API Result Data:");
    console.log(JSON.stringify(result.data, null, 2));

  } catch (error) {
    console.error("Error calling API:", error);
  }
}

testApi();
