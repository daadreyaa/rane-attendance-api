// const config = {
//     user: 'test',
//     password: '1234',
//     server: 'LAPTOP-4G3T9LGO\\RANE',
//     database: 'DHRM_PRD_DB',

//     // options: {
//     //     trustedconnection: true,
//     //     enableArithAbort: true,
//     //     instancename: 'RANE',
//     //     trustUserCertificate: false
//     // },
//     'requestTimeout': 300000,
//     port: 1433
// }

const config = {
    user: 'test',
    password: '1234',
    server: 'localhost',
    database: 'DHRM_PRD_DB',
    options: {
        trustServerCertificate: true,
        encrypt: false,
        trustedConnection: true,
        useUTC: true
    },
    driver: "msnodesqlv8",
};

module.exports = config;

// const config = {
//     'user': 'test',
//     'password': '1234',
//     'server': 'LAPTOP-4G3T9LGO\\RANE',
//     'requestTimeout': 300000,

//     options: {
//         enableArithAbort: false,
//         encrypt: false,
//         database: 'DHRM_PRD_DB',
//         // instance: 'RANE',

//     }

// };

// module.exports = config; 
