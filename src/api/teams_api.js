import { $host } from "./index";

async function getTeams() {
    // get all teams data (id, name, pic_url)
    const { data } = await $host.get('/api/teams');
    return data;
}

async function getFlags() {
    // get flags list
    const { data } = await $host.get('/api/teams/flags');
    return data;
}

async function getTeam(teamId) {
    // get team data (id, name, pic_url, country, region, flags)
    const { data } = await $host.get('/api/teams/read', {
        params: {
            teamId
        }
    });
    return data;
}

async function getTeamPLayers(teamId) {
    // get players of a team specified
    const { data } = await $host.get(`/api/teams/${teamId}/player`);
    return data;
}

async function addTeam(name, countryId, regionId, flagId, players) {
    // add a new team
    const { data } = await $host.post('/api/teams', {
        name, countryId, regionId, flagId, players
    });
    return data;
}

async function updateTeam(teamId, name, countryId, regionId, flagId, players) {
    // update a team
    const { data } = await $host.put('/api/teams', {
        teamId, name, countryId, regionId, flagId, players
    });
    return data;
}

async function removeTeam(teamId) {
    // create a new game event
    const { data } = await $host.delete('/api/teams',
        {
            params: {
                teamId
            }
        });
    return data;
}


export {
    getTeams,
    getFlags,
    getTeam,
    getTeamPLayers,
    addTeam,
    updateTeam,
    removeTeam
}
