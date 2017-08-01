module.exports = {
    jwtSecret: "23989-12089-09124-39019",
    jwtSession: {session: false, failureRedirect: '/login'},
    lease_rest_host: 'apaxsys004',
    lease_rest_port: 5113,
    ldap_url: 'ldap://10.10.5.5:389',
    ldap_baseDN: 'DC=adx,DC=intra',
    ldap_username: 'ldaptst@adx.intra',
    ldap_password: 'ldaptst123',
    ldap_userDomain: '@adx.intra'
};