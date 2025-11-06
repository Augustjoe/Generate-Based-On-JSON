import { NCard } from 'naive-ui'
import { CSSProperties } from 'vue'
import LoginFrom from './loginFrom'

export const Login = defineComponent({
  name: 'Login',
  setup: () => {
    const divStyle: CSSProperties = {
      height: '100%',
      paddingTop: '15vh',
      backgroundImage: `url(${new URL('@/assets/img/login.svg', import.meta.url).href}),radial-gradient(circle at 10% 20%, rgba(100, 149, 237, 0.25) 0%, rgba(65, 105, 225, 0.2) 40%, rgba(30, 144, 255, 0.1) 90%)`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '50%',
      backgroundSize: 'cover',
      position: 'relative',
    }
    const cardStyle = {
      margin: '0 auto',
      height: '500px',
      width: '500px',
      borderRadius: '10px',
    }
    const viewAccountBackgroundStyle: CSSProperties = {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: '0',
      left: '0',
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 0,
    }

    const lineStyle: CSSProperties = {
      position: 'absolute',
      background: 'linear-gradient(90deg, rgba(45, 140, 240, 0.2), rgba(0, 129, 255, 0.1))',
    }

    const line1Style: CSSProperties = {
      width: '300px',
      height: '2px',
      top: '15%',
      right: '5%',
      transform: 'rotate(-30deg)',
      animation: 'pulse 8s ease-in-out infinite',
    }

    const line2Style: CSSProperties = {
      width: '200px',
      height: '2px',
      bottom: '20%',
      left: '10%',
      transform: 'rotate(45deg)',
      animation: 'pulse 6s ease-in-out infinite 1s',
    }

    const line3Style: CSSProperties = {
      width: '150px',
      height: '2px',
      top: '40%',
      left: '5%',
      transform: 'rotate(-15deg)',
      animation: 'pulse 7s ease-in-out infinite 2s',
    }

    const square1Style: CSSProperties = {
      width: '80px',
      height: '80px',
      top: '10%',
      left: '15%',
      background: 'linear-gradient(45deg, rgba(45, 140, 240, 0.15), rgba(0, 129, 255, 0.05))',
      transform: 'rotate(30deg)',
      animation: 'rotate 15s linear infinite',
      position: 'absolute',
    }

    const square2Style: CSSProperties = {
      width: '60px',
      height: '60px',
      bottom: '15%',
      right: '10%',
      border: '2px solid rgba(45, 140, 240, 0.1)',
      background: 'transparent',
      animation: 'rotate 12s linear infinite reverse',
      position: 'absolute',
    }

    const triangleStyle: CSSProperties = {
      position: 'absolute',
      bottom: '30%',
      right: '20%',
      width: '0',
      height: '0',
      borderLeft: '50px solid transparent',
      borderRight: '50px solid transparent',
      borderBottom: '80px solid rgba(45, 140, 240, 0.08)',
      animation: 'float 10s ease-in-out infinite',
    }

    const wave1Style: CSSProperties = {
      position: 'absolute',
      opacity: 0.3,
      transformOrigin: 'bottom left',
      bottom: '0',
      left: '0',
      width: '100%',
      height: '120px',
      background:
        'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNDQwIDMyMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PHBhdGggZmlsbD0icmdiYSg0NSwgMTQwLCAyNDAsIDAuMikiIGQ9Ik0wLDMyMEMwLDI0MCA0MCwxNjAgODAsMTYwQzEyMCwxNjAgMTYwLDI0MCAyMDAsMjQwQzI0MCwyNDAgMjgwLDE2MCAzMjAsMTYwQzM2MCwxNjAgNDAwLDI0MCA0NDAsMjQwQzQ4MCwyNDAgNTIwLDE2MCA1NjAsMTYwQzYwMCwxNjAgNjQwLDI0MCA2ODAsMjQwQzcyMCwyNDAgNzYwLDE2MCA4MDAsMTYwQzg0MCwxNjAgODgwLDI0MCA5MjAsMjQwQzk2MCwyNDAgMTAwMCwxNjAgMTA0MCwxNjBDMTA4MCwxNjAgMTEyMCwyNDAgMTE2MCwyNDBDMTIwMCwyNDAgMTI0MCwxNjAgMTI4MCwxNjBDMTMyMCwxNjAgMTM2MCwyNDAgMTQwMCwyNDBDMTQ0MCwyNDAgMTQ0MCwxNjAgMTQ0MCwxNjBMMTQ0MCwzMjBMMCwzMjBaIj48L3BhdGg+PC9zdmc+")',
      backgroundSize: '100% 120px',
      animation: 'wave-left-to-right 15s ease-in-out infinite',
      transform: 'rotate(-2deg)',
    }

    const wave2Style: CSSProperties = {
      position: 'absolute',
      opacity: 0.3,
      transformOrigin: 'bottom left',
      bottom: '0',
      left: '0',
      width: '100%',
      height: '100px',
      background:
        'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNDQwIDMyMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PHBhdGggZmlsbD0icmdiYSg0NSwgMTQwLCAyNDAsIDAuMTUpIiBkPSJNMCwzMjBDMCwyNDAgNjAsMTgwIDEyMCwxODBDMTgwLDE4MCAyNDAsMjQwIDMwMCwyNDBDMzYwLDI0MCA0MjAsMTgwIDQ4MCwxODBDNTQwLDE4MCA2MDAsMjQwIDY2MCwyNDBDNzIwLDI0MCA3ODAsMTgwIDg0MCwxODBDOTAwLDE4MCA5NjAsMjQwIDEwMjAsMjQwQzEwODAsMjQwIDExNDAsMTgwIDEyMDAsMTgwQzEyNjAsMTgwIDEzMjAsMjQwIDEzODAsMjQwQzE0NDAsMjQwIDE0NDAsMTgwIDE0NDAsMTgwTDE0NDAsMzIyTDAsMzIyWiI+PC9wYXRoPjwvc3ZnPg==")',
      backgroundSize: '100% 100px',
      animation: 'wave-left-to-right 18s ease-in-out infinite',
      animationDelay: '-5s',
      transform: 'rotate(-1deg)',
    }

    const wave3Style: CSSProperties = {
      position: 'absolute',
      opacity: 0.3,
      transformOrigin: 'bottom left',
      bottom: '0',
      left: '0',
      width: '100%',
      height: '80px',
      background:
        'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNDQwIDMyMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PHBhdGggZmlsbD0icmdiYSg0NSwgMTQwLCAyNDAsIDAuMSkiIGQ9Ik0wLDMyMEMwLDI2MCAzMCwyMDAgNjAsMjAwQzkwLDIwMCAxMjAsMjYwIDE1MCwyNjBDMTgwLDI2MCAyMTAsMjAwIDI0MCwyMDBDMjcwLDIwMCAzMDAsMjYwIDMzMCwyNjBDMzYwLDI2MCAzOTAsMjAwIDQyMCwyMDBDNDUwLDIwMCA0ODAsMjYwIDUxMCwyNjBDNTQwLDI2MCA1NzAsMjAwIDYwMCwyMDBDNjMwLDIwMCA2NjAsMjYwIDY5MCwyNjBDNzIwLDI2MCA3NTAsMjAwIDc4MCwyMDBDODEwLDIwMCA4NDAsMjYwIDg3MCwyNjBDOTAwLDI2MCA5MzAsMjAwIDk2MCwyMDBDOTkwLDIwMCAxMDIwLDI2MCAxMDUwLDI2MEMxMDgwLDI2MCAxMTEwLDIwMCAxMTQwLDIwMEMxMTcwLDIwMCAxMjAwLDI2MCAxMjMwLDI2MEMxMjYwLDI2MCAxMjkwLDIwMCAxMzIwLDIwMEMxMzUwLDIwMCAxMzgwLDI2MCAxNDEwLDI2MEMxNDQwLDI2MCAxNDQwLDIwMCAxNDQwLDIwMEwxNDQwLDMyMEwwLDMyMFoiPjwvcGF0aD48L3N2Zz4=")',
      backgroundSize: '100% 80px',
      animation: 'wave-left-to-right 20s ease-in-out infinite',
      animationDelay: '-2s',
    }

    return () => (
      <div style={divStyle}>
        <div style={viewAccountBackgroundStyle}>
          <div style={{ ...lineStyle, ...line1Style }} />
          <div style={{ ...lineStyle, ...line2Style }} />
          <div style={{ ...lineStyle, ...line3Style }} />
          <div style={square1Style} />
          <div style={square2Style} />
          <div style={triangleStyle} />
          <div style={wave1Style} />
          <div style={wave2Style} />
          <div style={wave3Style} />
        </div>
        <NCard style={cardStyle} hoverable>
          <LoginFrom></LoginFrom>
        </NCard>
      </div>
    )
  },
})

export default Login
