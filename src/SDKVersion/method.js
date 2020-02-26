//import {addStudent, getStudentList, removeStudentById} from '../api/student'
//import {addClasses, updateClasses} from "../api/class"
import {getStudentList} from '../api/student'

export default{
  //条件搜索
  handleSearch() {
    this.pagination.current = 1;
    this.getTableData()
  },
  //重置搜索条件
  resetForm(formName) {
    this.$refs[formName].resetFields();
  },
  //设置分页大小
  handlePageSizeChange(pageSize) {
    this.pagination.pageSize = pageSize;
    this.getTableData();
  },
  //设置页码
  handleCurrentChange (current) {
    this.pagination.current = current;
    this.getTableData();
  },
  handleCloseAddDialog() {
    this.classFrom =  Object.assign({}, this.defaultClassFrom);
    this.$refs.addClassForm.resetFields();
    this.$refs.createClass.close();
  },
  handleCloseEditDialog(){
    this.editFrom =  Object.assign({}, this.defaultClassFrom);
    this.$refs.editClassForm.resetFields();
    this.$refs.editClass.close();
  },
  handleSave() {                                //---------------------提交新建表单
    this.$refs.addClassForm.validate((valid) => {
      if (valid) {
        const params = Object.assign({}, this.classFrom);
        addClasses(params).then((res) => {
          this.$message({
            type: 'info',
            message: '新建成功'
          });
          this.$refs.createClass.close();
          this.classFrom =  Object.assign({}, this.defaultClassFrom);
          this.$refs.addClassForm.resetFields();
          this.getTableData();
        }).catch((err) => {
          this.$message({
            type: 'warning',
            message: '新建失败'
          });
          console.log(err);
        });
      } else {
        console.log('error submit!!');
        return false;
      }
    });
  },
  editClass(scope){                         //---------------------编辑操作
    this.dialogEditClass = true;
    this.updata = Object.assign({}, {
      sdk_version_number: scope.row.data.sdk_version_number,
      sdk_itrative_version: scope.row.data.sdk_itrative_version,
      platform: scope.row.data.platform,
      id:scope.row.id
    });
  },
  updateClassesById(updata){
    console.log(this.updata);
    let params = Object.assign({}, this.updata);

    console.log(params);

    this.$http.delete('http://localhost:8000/api/sdkversion/'+params.id);
    this.$http.post('http://localhost:8000/api/sdkversion/new', this.updata)
      .then((res) => {
      console.log(res);
      this.dialogEditClass = false;
      this.getTableData();
      this.$message.info('修改成功');
    }).catch((err) => {
      console.log(err);
      this.$message.error('修改失败');
    });
  },
  delStu(scope){                            //---------------------删除学生
    this.$confirm('此操作将删除选中项, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.removeStudent(scope);
    }).catch(() => {
      this.$message({
        type: 'warning',
        message: '已取消删除'
      });
    });
  },
  removeStudent(scope){
    const params = {
      id: scope.row.id
    };
    console.log(scope);
    this.$http.delete('http://localhost:8000/api/sdkversion/'+params.id).then((res) => {
      this.getTableData();
      this.$message({
        type: 'info',
        message: '删除成功'
      });
    }).catch((err) => {
      console.log(err);
    })
  },

  handleCloseAddStuDialog(){
    this.stuFrom =  Object.assign({}, this.defaultstuFrom);
    this.$refs.addStuForm.resetFields();
    this.$refs.createStudent.close();
  },
  addStudent(scope){
    this.dialogCreateStu = true;
    this.stuFrom.classesId = scope.row.id;
    console.log("------------------"+this.stuFrom.classesId);
  },
  handleSaveStu(){
    this.$refs.addStuForm.validate((valid) => {
      if (valid) {
        const params = Object.assign({}, this.stuFrom);
        addStudent(params).then((res) => {
          this.$message({
            type: 'info',
            message: '新建成功'
          });
          this.$refs.createStudent.close();
          this.stuFrom =  Object.assign({}, this.defaultstuFrom);
          this.$refs.addStuForm.resetFields();
        }).catch((err) => {
          this.$message({
            type: 'warning',
            message: '新建失败'
          });
          console.log(err);
        });
      } else {
        console.log('error submit!!');
        return false;
      }
    });
  },
  addClass(){                         //---------------------编辑操作
    //this.dialogFormClass = true;
    this.form = Object.assign({}, {
      sdk_version_number: '',
      sdk_itrative_version: '',
      platform: '',
      updateTime: ''
    });
  },

    getTableData(){                           //---------------------获取列表数据
    let para = {
      pageNum: this.pagination.current,
      pageSize: this.pagination.pageSize,
      ...this.filter
    };
    console.log(para);
    console.log(getStudentList());
    getStudentList().then((res) => {
      console.log(res);
      //this.studentData = res.data.records;
      //this.pagination.total = res.data.total;
      this.studentData = res.data;
    });
  },

  postInfo(form){
    this.$http.post('http://localhost:8000/api/sdkversion/new', this.form).then(function (response) {
      this.$message({
        type: 'info',
        message: '新建成功'
      });
      this.getTableData();
    }, function (response) {
      this.$message({
        type: 'warning',
        message: '新建失败'
      });
      console.log(err);
    })
  },

}
