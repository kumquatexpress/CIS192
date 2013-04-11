import socket, threading, time, re
from base64 import b64encode
from hashlib import sha1

def handle(s,a):
  print a
  handshake_data = s.recv(4096)
  client_key = re.search("Sec-WebSocket-Key:\s+(.*?)[\n\r]+", handshake_data).groups()[0].strip()
  handshake_response = (
    'HTTP/1.1 101 Web Socket Protocol Handshake',
    'Upgrade: WebSocket',
    'Connection: Upgrade',
    'WebSocket-Location: ws://localhost:9876/',
    'Sec-WebSocket-Accept: {hashed_key}\r\n\r\n'
  )
  WSID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
  server_key = b64encode(sha1(client_key + WSID).digest())
  response = "\r\n".join(handshake_response).format(hashed_key=server_key)
  print response
  s.send(response)
  time.sleep(1)
  s.send('\x00hello\xff')
  time.sleep(1)
  s.send('\x00world\xff')
  s.close()

s = socket.socket()
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
s.bind(('', 9876));
s.listen(1);
print "Now listening on port 9876"
while 1:
  t,a = s.accept();
  print "Connection received"
  threading.Thread(target = handle, args = (t,a)).start()