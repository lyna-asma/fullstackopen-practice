

const Header = ({course}) => {
    console.log("Header component props" , {course});
    
  return (
    <div> {course.name}</div>
  )
}

export default Header