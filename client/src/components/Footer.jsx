export default function Footer() {
  return (
    <div className='w-100 mt-5' style={{ backgroundColor: '#100C08', height: '5rem'}}>
      <div className='row w-100'>
        <p className='text-white fs-4 col my-3'>Created by Kristian Krog</p>
        <a className='col my-3 fs-4 text-white text-decoration-none' href='https://www.linkedin.com/in/kristian-krog/' target='blank'>My Linkedin</a>
        <a className='col my-3 fs-4 text-white text-decoration-none' href='https://github.com/krog-kristian' target='blank'>My GitHub</a>
      </div>
    </div>
  )
}
