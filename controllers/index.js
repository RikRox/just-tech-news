const router = require('express').Router();


//added for hojme-routes
const homeRoutes = require('./home-routes.js');

router.use('/', homeRoutes);






const apiRoutes = require('./api');

router.use('/api', apiRoutes);

router.use((req, res) => {
    res.status(404).end();
});


module.exports = router;