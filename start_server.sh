# pm2 `http-server  dist/samples/qiniu-rtn/client --ssl -c-1` --name static-server 
node scripts/compile.js 
node src/samples/qiniu-rtn/client/live_server.js