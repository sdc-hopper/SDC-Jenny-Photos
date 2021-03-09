# Amazon Photos Clone

## API Request Types

### 1. Create
Endpoint: `/photos/create/`
Request Type: `POST`
Required Body:
```
{
  photoUrl1: STRING, (REQUIRED)
  photoUrl2: STRING,
  photoUrl3: STRING,
  photoUrl4: STRING,
  photoUrl5: STRING,
  photoUrl6: STRING,
  photoUrl7: STRING,
}
```
### 2. Read
Endpoint: `/photos/id/:productId`
Request Type: `GET`
### 3. Update
Endpoint: `/photos/update/:productId`
Request Type: `PUT`
Required Body: (only include headers for desired updates)
```
{
  photoUrl1: STRING,
  photoUrl2: STRING,
  photoUrl3: STRING,
  photoUrl4: STRING,
  photoUrl5: STRING,
  photoUrl6: STRING,
  photoUrl7: STRING,
}
```
### 4. Delete
Endpoint: `/photos/delete/:productId`
Request Type: `DELETE`