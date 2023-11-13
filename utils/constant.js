exports.noAuthRoutes = [
    { url: "/test", methods: ["GET"] },
    { url: "/api/user/login", methods: ["POST"] },
    { url: "/api/user/signup", methods: ["POST"] },
    { url: "/api/user/reset-req", methods: ["POST"] },
    
    { url: "/scheduler/cron-job", methods: ["GET"] },
    { url: /^\/s\/.{8,14}/, methods: ["GET"] },
];
