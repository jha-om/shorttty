import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const Home = () => {
    return (
        <div className="min-h-[50vh] flex-col max-w-4xl md:max-w-5xl mx-auto justify-center px-4 py-8">
            <div className="w-full">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-center text-white leading-tight break-words">
                    <span>shorttty</span> <span>your</span> URL
                </h2>
            </div>
            <div>

                <form className="">
                    <Input
                        type="url"
                        placeholder="Enter the long ass URL"
                        className="h-full flex-1 p-4 outline-none"
                    />
                    <Button className="h-full px-10" type="submit">Shorttit</Button>
                </form>
            </div>
        </div>
    )
}

export default Home