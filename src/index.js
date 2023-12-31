// Native imports and 🦈.js
import shark from './🦈.js';
import process from 'node:process';
// Third party imports
import { Command } from 'commander';

// Define and set up program, and add the --verbose flag
const program = new Command()
    .name("sharkkey")
    .description(shark.art())
    .option("-v, --verbose", "Output verbose logs")
    .showHelpAfterError(true);

// Create the encrypt command
program // Set basic info
    .command("encrypt")
    .name("encrypt")
    .description("Encrypt files, folders, or strings.")
    // Set Arguments and options
    .argument('<file-or-string>', 'File to encrypt - or string if the -s or --string flag is used.')
    .argument('<pass>', "Password")
    .option('-cid, --createID',
        "Create a ID file along with the encrypted file.")
    .option('-do, --deleteOriginal',
        "Delete original file after encryption")
    .option('-s, --string',
        "Encrypt a string instead of a file")
    .option('-c, --copy',
        "Copy the encrypted file or string to the clipboard after encryption")
    .option('--hwid',
        "Include the hardware ID as part of the encryption process")
    .option('--distro',
        "Include the name of the operating system distribution as part of the encryption process")
    .option('--lip',
        "Include the local IP address as part of the encryption process")
    .option('--username',
        "Include the username associated with the user account as part of the encryption process")
    .option('--timezone',
        "Include the current timezone information as part of the encryption process")
    .option('--locale',
        "Include the locale settings (language and region) as part of the encryption process")
    .option('--hostname',
        "Include the hostname of the system as part of the encryption process")
    .option('--platform',
        "Include the platform information (e.g., operating system type) as part of the encryption process")
    .option('--serial',
        "Include the serial number of the device as part of the encryption process")
    .option('--filename',
        "Include the name of the file being encrypted as part of the encryption process")
    .option('--totp',
        "Require TOTP authentacation before decrypting")
    .option('--compression',
        "Compress output")
    .option('--usb',
        "Require specefic USB drive to be connected before decrypting")
    .action((file, pass, options) => {
        let aaa = handleOpts(options);
        let features = aaa[0];
        options = aaa[1];

        // Get the hashed key
        const hashKey = shark.cryptography.calculateKey(
            pass,
            features,
            options.createID,
            file);

        try {
            // Text that will be parsed and shown when done

            // For file encryption
            let infoStrFile = `✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨
            Filename: ${file}
            Key: ${hashKey}
            Features: ${Array.from(features).toString()}
            Deleted Original: ${options.deleteOriginal}
            Created ID: ${options.createID}
            Remember never to share the Key with anyone,
            as they would be able to decrypt your file with it.
            
            You can decrypt the file using 🦈🔑, your password,
            and if you made one, the file's 🦈🔑🪪
            ✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨`;

            // For string encryption
            let infoStr = `✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨
            Encrypted string: __string__
            Key: ${hashKey}
            Features: ${Array.from(features).toString()}

            Remember never to share the Key with anyone,
            as they would be able to decrypt your file with it.
            
            You can decrypt the string using 🦈🔑 & your password
            ✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨`;

            // Encrypt the data
            let encrypted = shark.cryptography.encrypt(
                hashKey,
                file, {
                    features: features || [],
                    createIDFile: options.createID,
                    isString: options.string,
                    doCopy: options.copy,
                    userkey: pass || "cHaNgE-mE",
                    compression: options.compression || false
                }, options.deleteOriginal
            );



            // Define variables here so we can use them in the switch statement
            let outputStr, outputMessage;

            // Handle how (and what) output to the user
            switch (options.string) {
                case true: // We encrypted a string, so show info relavant to that
                    outputStr = infoStr.replace(new RegExp(/ {12}/g), "") // outputStr if options.copy if false
                        .replace("__string__", encrypted); // replace __string__ with the actual string

                    // If options.copy is true, apply the replace() function, if not just use outputStr as is
                    outputMessage = options.copy ?
                        outputStr.replace("Remember", "The encrypted string has been copied to your clipboard.\n\nRemember") : outputStr;
                    break;

                case false: // We encrypted a file, so show info relavant to that
                    outputStr = infoStrFile.replace(new RegExp(/ {12}/g), ""); // outputStr if options.copy if false

                    // If options.copy is true, apply the replace() function, if not just use outputStr as is
                    outputMessage = options.copy ?
                        outputStr.replace("Remember", "The contents of the encrypted file has been copied to your clipboard.\n\nRemember") : outputStr;
                    break;

                default: // Recieved unexpected input, Throw error.
                    throw new Error("Value of options.string was unexpected: " + options.string);
            } // Show the output
            console.log(outputMessage);
        } catch (error) {
            console.log("Something happened while trying to encrypt!");
            throw new Error(error);
        }
    });

// Create the decrypt command 
program // Set basic info
    .command("decrypt")
    .description("Decrypt files, folders, or strings")
    // Set arguments and options
    .argument('<file-or-string>', 'File to decrypt - or string if the -s or --string flag is used.')
    .argument('<pass>', "Password")
    .argument('[id-file]',
        "(optional) 🦈🔑 ID file path")
    .option('-uid, --useID',
        "Use a 🦈🔑 ID File to decrypt the file, along with the pass.")
    .option('-do, --deleteOriginal',
        "Delete original file after encryption")
    .option('-s, --string',
        "Encrypt a string instead of a file")
    .option('--compression',
        'Decompress output')
    .option('-c, --copy',
        "Copy the decrypted file or string to the clipboard after decryption")
    .action((file, pass, idfile, options) => {
        // Handle the decrypt command
        let aaa = handleOpts(options);
        options = aaa[1];

        // Define the different output strings
        let infoStr = `✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨
        Decrypted string: __string__

        🦈🔑
        ✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨`;
        let infoStrFile = `✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨
        Decrypted file: ${file.replace(".🦈🔑","")}

        🦈🔑
        ✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨`;

        // Check if we're gonna be using an ID file to decrypt
        if (options.useID) {
            // Use ID to decrypt fiie
            // 🦈--> Implement logic
            throw new Error("Not implemented");
        } else { // Dont use ID to decrypt file
            let originalText;
            try {
                originalText = shark.cryptography.decrypt(
                    pass,
                    file,
                    options.deleteOriginal,
                    options.string,
                    options.copy,
                    options.compression
                );
            } catch (err) {
                console.log("[🦈🔑] We were unable to decrypt the data with the info you provided.");
                process.exit(1);
            }
            // Define variables here so we can use them in the switch statement
            let outputStr, outputMessage;
            switch (options.string) {
                case true:
                    // We decrypted a string, so show info relavant to that
                    outputStr = infoStr // outputStr if options.copy if false
                        .replace(new RegExp(/ {8}/g), "") // Remove all unwanted whitespaces
                        .replace("__string__", originalText); // Replace __string__ with the actual output

                    // If options.copy is true, apply the replace() function, if not just use outputStr as is
                    outputMessage = options.copy ?
                        outputStr.replace("🦈🔑\n✨", "The decrypted string has been copied to your clipboard\n\n🦈🔑\n✨") : outputStr;
                    break;
                case false:
                    // We decrypted a file, so show info relavant to that
                    outputStr = infoStrFile
                        .replace(new RegExp(/ {8}/g), "");

                    // If options.copy is true, apply the replace() function, if not just use outputStr as is
                    outputMessage = options.copy ?
                        outputStr.replace("🦈🔑\n✨", "The content of the decrypted file has been copied to your clipboard\n\n🦈🔑\n✨") : outputStr;
                    break;
                default: // options.string was neither true or false
                    throw new Error("Value of options.string was unexpected");
            }
            // Show the output
            console.log(outputMessage);
        }
    });

// Create the checkid command
program // Set basic info
    .command("checkid")
    .description("Get information about a 🦈🔑 ID - If you have the password")
    // Set arguments and options
    .argument('<file>', '🦈🔑 ID file')
    .argument('<pass>', "Password")
    .option('-c, --copy',
        "Copy the id info to the clipboard (JSON)")
    .action((file, password, options) => {
        // Handle checkid command
        let aaa = handleOpts(options);
        options = aaa[1];
        // Get info from the file
        let idInfo;
        try {
            idInfo = shark.cryptography.checkid(file, password, options.copy);
        } catch (err) { // Show "error" to user
            console.log("[🦈🔑] We were unable to decrypt the ID file using the info you provided.");
            process.exit(1); // End with failure code
        }

        // Output template
        let infoStr = `✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨
        ID Info
        File: ${file}
        Associated Files: ${JSON.stringify(idInfo.associatedFiles)}
        Expires: ${idInfo.expires}
        id: ${JSON.stringify(idInfo.id)}

        🦈🔑
        ✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨`;

        let outputStr = infoStr.replace(new RegExp(/ {8}/g), ""); // outputStr if options.copy if false

        // If options.copy is true, apply the replace() function, if not just use outputStr as is
        let outputMessage = options.copy ? outputStr.replace("🦈🔑\n", "The raw JSON data has been copied to your clipboard.\n\n🦈🔑\n") : outputStr;

        // Show the output
        console.log(outputMessage);
    });
program.parse(process.argv);

function handleOpts(opts) {
    let features = [];
    let values = { deleteOriginal: false, createID: false, string: false, copy: false, useID: false, verbose: false, compression: false };
    for (const opt in opts) {
        if (["deleteOriginal", "createID", "string", "copy", "useID", "verbose", "compression"].includes(opt)) {
            values[opt] = true;
            continue;
        }
        features.push(opt);
    }
    if (features.length === 0) { features.push("None, this means anyone with the password can decrypt."); }
    return [features, values];
}