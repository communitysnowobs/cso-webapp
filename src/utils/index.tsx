export const log = (func: (...args: any[]) => any, name: string) => {
    return (...args: any[]) => {
        console.log(name, args.slice(0,-1))
        return func(...args)
    }
}