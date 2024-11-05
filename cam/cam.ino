#include <WebServer.h>
#include <WiFi.h>
#include <esp32cam.h>
const char* WIFI_SSID = "Tâm";
const char* WIFI_PASS = "19781122334455";
 
WebServer server(80);
 
static auto initialResolution = esp32cam::Resolution::find(800, 600);
void serveJpg()
{
  auto frame = esp32cam::capture();
  if (frame == nullptr) {
    Serial.println("CAPTURE FAIL");
    server.send(503, "", "");
    return;
  }
  Serial.printf("CAPTURE OK %dx%d %db\n", frame->getWidth(), frame->getHeight(),
                static_cast<int>(frame->size()));
 
  server.setContentLength(frame->size());
  server.send(200, "image/jpeg");
  WiFiClient client = server.client();
  frame->writeTo(client);
}
 
void handleJpg()
{
  if (!esp32cam::Camera.changeResolution(initialResolution)) {
    Serial.println("SET-MID-RES FAIL");
  }
  serveJpg();
}
 
void  setup(){
  Serial.begin(115200);
  Serial.println();
  {
    using namespace esp32cam; 
    Config cfg;
    cfg.setPins(pins::AiThinker);
    cfg.setResolution(initialResolution);
    cfg.setBufferCount(2);
    cfg.setJpeg(80);
 
    bool ok = Camera.begin(cfg);
    Serial.println(ok ? "CAMERA OK" : "CAMERA FAIL");
  }
  WiFi.persistent(false);
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED){
    delay(500);
  }
  Serial.print("http://");
  Serial.print(WiFi.localIP());
  Serial.println("/cam");
 
  server.on("/cam", handleJpg);
  server.begin();
}
 
void loop()
{
  server.handleClient();
}