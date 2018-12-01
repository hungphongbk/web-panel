import { _shellCommandAsync } from "./shell";

//TODO: acme.sh command not found
const generate = ({ uid, domain, webRoot }) => async (logger = () => {}) => {
  console.log(await _shellCommandAsync("echo $PATH"))();
  let output = await _shellCommandAsync(
    `acme.sh --issue -w ${webRoot} -d ${domain} --force`,
    {
      cwd: webRoot,
      uid
    }
  )(logger);

  // Get last 4 lines
  const tmp = output.trim().split("\n");
  output = tmp.slice(tmp.length - 4).join("\n");
  console.log(output);
};

const SSLCert = {
  generate
};
export default SSLCert;
