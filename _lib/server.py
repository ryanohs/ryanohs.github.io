import http.server
import os
import urllib.parse
import mimetypes


class MyRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        file_path = parsed_url.path.strip('/')

        if file_path == '':
            file_path = 'index.html'
        
        if os.path.exists(file_path):
            self.send_response(200)
            if file_path.endswith('.html'):
                content_type = 'text/html; charset=UTF-8'
            else:
                content_type, encoding = mimetypes.guess_type(file_path)
                content_type = content_type or 'application/octet-stream'
            self.send_header('Content-type', content_type)
            self.end_headers()
            with open(file_path, 'rb') as file:
                self.wfile.write(file.read())
            return
        
        if not file_path.endswith('.html'):
            file_path += '.html'
        
        if os.path.exists(file_path):
            self.send_response(200)
            self.send_header('Content-type', 'text/html; charset=UTF-8')
            self.end_headers()
            
            with open(file_path, 'rb') as file:
                self.wfile.write(file.read())
        else:
            self.send_response(404)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(b'404 Not Found')


if __name__ == '__main__':
    server_address = ('', 8000)  # Change the port as needed
    os.chdir('_site')
    httpd = http.server.HTTPServer(server_address, MyRequestHandler)
    print('Server started on port 8000...')
    httpd.serve_forever()
