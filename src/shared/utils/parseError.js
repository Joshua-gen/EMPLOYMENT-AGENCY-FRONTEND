// Pinag-iisa ang error format ng Laravel:
// 422 -> { message, errors: { field: ["..."] } }
// 400 -> { status: false, message }
const parseError = (error) => ({
    message: error.response?.data?.message ?? error.message ?? "Something went wrong",
    errors: error.response?.data?.errors ?? {},
});

export default parseError;
