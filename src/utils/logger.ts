const log = async (message: string, error: boolean): Promise<void> => {
    if (error === true) {
        console.log(`Stylar >> ${message}`);
    } else {
        console.log(`Stylar >> ${message}`);
    }
}

export default log;