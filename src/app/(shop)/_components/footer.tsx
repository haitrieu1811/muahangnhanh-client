import Link from 'next/link'

import Logo from '@/components/logo'
import { Separator } from '@/components/ui/separator'

const FOOTERS = [
  {
    heading: 'Frontend',
    pages: [
      {
        url: 'https://ui.shadcn.com/',
        name: 'ShadcnUI'
      },
      {
        url: 'https://nextjs.org/',
        name: 'NextJS'
      },
      {
        url: 'https://tailwindcss.com/',
        name: 'TailwindCSS'
      }
    ]
  },
  {
    heading: 'Backend',
    pages: [
      {
        url: 'https://nodejs.org/',
        name: 'NodeJS'
      },
      {
        url: 'https://expressjs.com/',
        name: 'ExpressJS'
      },
      {
        url: 'https://www.mongodb.com/',
        name: 'MongoDB'
      }
    ]
  },
  {
    heading: 'Theo dõi tôi',
    pages: [
      {
        url: 'https://github.com/haitrieu1811',
        name: 'Github'
      },
      {
        url: 'https://www.facebook.com/tran.trieu.5074/',
        name: 'Facebook'
      }
    ]
  }
] as const

export default function ShopFooter() {
  return (
    <footer className='bg-card border-t'>
      <div className='container p-4 py-6 lg:py-8'>
        <div className='md:flex md:justify-between'>
          <div className='mb-6 md:mb-0'>
            <Logo />
          </div>
          <div className='grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3'>
            {FOOTERS.map((footer, index) => (
              <div key={index}>
                <h2 className='mb-6 text-sm font-semibold uppercase'>{footer.heading}</h2>
                <ul className='text-muted-foreground text-sm font-medium space-y-4'>
                  {footer.pages.map((page) => (
                    <li key={page.url}>
                      <Link target='_blank' href={page.url} className='hover:underline'>
                        {page.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <Separator className='my-6' />
        <div className='sm:flex sm:items-center sm:justify-between'>
          <span className='text-sm text-gray-500 sm:text-center dark:text-gray-400'>
            © 2025 Tran Hai Trieu. All Rights Reserved.
          </span>
          <div className='flex space-x-4 mt-4 sm:justify-center sm:mt-0'>
            <Link target='_blank' href='https://github.com/haitrieu1811' className='text-muted-foreground'>
              <svg
                className='w-4 h-4'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z'
                  clipRule='evenodd'
                />
              </svg>
              <span className='sr-only'>Github page</span>
            </Link>
            <Link target='_blank' href='https://www.facebook.com/tran.trieu.5074/' className='text-muted-foreground'>
              <svg
                className='w-4 h-4'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 8 19'
              >
                <path
                  fillRule='evenodd'
                  d='M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z'
                  clipRule='evenodd'
                />
              </svg>
              <span className='sr-only'>Facebook page</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
