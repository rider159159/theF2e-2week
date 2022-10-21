import aos from 'aos'
import 'aos/dist/aos.css'
export const AOS = {
  install: () => new (aos).init()
}