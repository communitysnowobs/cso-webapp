/** @jsx jsx */
import { jsx } from '@emotion/core'
import { NextFC } from "next"
import Link from "next/link"

interface A_Props {
  href: string,
  target?: string,
  className?: string,
  prefetch?: boolean
}

export const A : NextFC<A_Props> = ({href, children, target="_self", prefetch=false, className}) => (
  <Link href={href} passHref prefetch={prefetch}>
    <a target={target} className={className} css={{
      color: "#08f",
      textDecoration: "underline",
      '&:hover,:link,:active,:visited': {
        color: '#08f'
      }
    }}>{children}</a>
  </Link>
)
