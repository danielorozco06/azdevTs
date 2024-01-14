import { WebApi, getPersonalAccessTokenHandler } from 'azure-devops-node-api';
import { config } from 'dotenv';

/**
 * Checks if the specified environment variable is set and returns its value.
 * Throws an error if the environment variable is not set.
 *
 * @param {string} variableName - The name of the environment variable to check.
 * @returns {string} The value of the environment variable.
 * @throws Will throw an error if the environment variable is not set.
 */
function ensureEnvVariableIsSet(variableName: string): string {
    const envVariable = process.env[variableName];
    if (!envVariable) {
        throw new Error(`Environment variable ${variableName} is not set`);
    }
    return envVariable;
}


const run = async () => {
    // Initialize dotenv configuration to load environment variables from .env file
    config();

    // Read the environment variables
    const azureDevOpsPAT = ensureEnvVariableIsSet('AZURE_DEVOPS_PAT');
    const azureDevOpsUri = ensureEnvVariableIsSet('AZURE_DEVOPS_URI');

    try {
        // Create an Azure DevOps connection and authenticate
        const authHandler = getPersonalAccessTokenHandler(azureDevOpsPAT);
        const connection = new WebApi(azureDevOpsUri, authHandler);

        // Fetch the GIT API client from the connection
        const gitApi = await connection.getGitApi();

        // Fetch the repositories
        const repositories = await gitApi.getRepositories();

        // Log the repository names
        console.log('Azure Repositories:');
        for (const repo of repositories) {
            console.log(repo.name);
        }
    } catch (error) {
        console.error(`Error: ${error}`);
    }
};

run();
