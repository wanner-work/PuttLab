export default interface DrawerProps<SuccessParam = undefined> {
    open?: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: (param?: SuccessParam) => void
}