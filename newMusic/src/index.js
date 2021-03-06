import dva from 'dva';
import './styles/common.css';

//引入路由模式
//import createHistory from 'history/createBrowserHistory';
import createHistory from 'history/createHashHistory';

var FastClick = require('fastclick');
FastClick.attach(document.body);
// 1. Initialize
const app = dva({
    history: createHistory(),
  });

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/example').default);
app.model(require('./models/play').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
